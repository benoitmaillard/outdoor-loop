import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, filter, Observable, Subject, throwError, zip, map } from 'rxjs';
import { GraphHopperService } from '../graphhopper/graphhopper.service';
import { RoutePath } from '../graphhopper/route-path.model';
import { Point } from './point.model';
import { haversine } from './utils';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public zoomLevel: number = 11;
  public center: [number, number] = [7.17, 46.64];
  public waypoints = signal<Point[]>([]);
  public paths = signal<RoutePath[]>([]);
  private error = new Subject<string>();
  public aggregateStats = computed(() => this.computeStats());
  public errorStream = this.error.asObservable();

  constructor(private graphhopperService: GraphHopperService) { }

  private updateWaypoints(index: number, replacement: Point) {
    this.waypoints.update(old => [
      ...old.slice(0, index),
      replacement,
      ...old.slice(index + 1)
    ]);
  }

  private updatePaths(index: number, newPaths: RoutePath[]) {
    this.paths.update(old => [
      ...old.slice(0, Math.max(0, index - 1)),
      ...newPaths,
      ...old.slice(index + 1)
    ]);
  }

  addWayPoint(waypoint: Point) {
    const waypoints = this.waypoints();
    const lastWaypoint = waypoints.at(-1);
    const path$ = lastWaypoint
      ? this.computePath(lastWaypoint, waypoint).pipe(map(path => [path]))
      : this.computePath(waypoint, waypoint).pipe(map(path => [] as RoutePath[]));

    path$.subscribe(newPaths => {
      this.paths.update(old => [...old, ...newPaths]);
      this.waypoints.update(old => [...old, waypoint]);
    });
  }

  removeWayPoint(index: number) {
    const waypoints = this.waypoints();
    this.waypoints.update(old => [...old.slice(0, index), ...old.slice(index + 1)]);

    if (index === 0) {
      this.paths.update(old => old.slice(1));
    } else if (index === waypoints.length - 1) {
      this.paths.update(old => old.slice(0, -1));
    } else {
      this.computePath(waypoints[index - 1], waypoints[index + 1])
        .subscribe(newPath => this.updatePaths(index, [newPath]));
    }
  }

  moveWayPoint(replacement: Point, index: number) {
    // we need this to make sure that the marker gets updated properly
    const saveLat = this.waypoints()[index].lat;
    const saveLon = this.waypoints()[index].lon;
    this.waypoints()[index].lat = replacement.lat;
    this.waypoints()[index].lon = replacement.lon;

    const waypoints = this.waypoints();
    let path$: Observable<any>;

    if (index == 0) {
      path$ = this.computePath(replacement, waypoints[index + 1]).pipe(map(path => [path]));
    } else if (index == waypoints.length - 1) {
      path$ = this.computePath(waypoints[index - 1], replacement).pipe(map(path => [path]));
    } else {
      path$ = zip(
        this.computePath(waypoints[index - 1], replacement),
        this.computePath(replacement, waypoints[index + 1])
      );
    }

    path$.subscribe({
      next: newPaths => {
        this.updatePaths(index, newPaths);
        this.updateWaypoints(index, replacement);
      },
      error: () => {
        this.waypoints()[index].lat = saveLat;
        this.waypoints()[index].lon = saveLon;
      }
    });
  }

  computePath(from: Point, target: Point): Observable<RoutePath> {
    return this.graphhopperService.computePath([from, target]).pipe(
      catchError(e => {
        this.error.next("No valid point nearby")
        return throwError(() => e);
      })
    );
  }

  distanceBetweenPoints(routePath: RoutePath, from: number, to: number) {
    let dist = 0;
    for (let i = from; i < to; i++) {
      const start = routePath.points.coordinates[i];
      const end = routePath.points.coordinates[i+1];
      dist += haversine(start[1], start[0], end[1], end[0]);
    }

    return dist;
  }

  // returns the distance for each value of the given detail
  detailDistanceByValue(routePath: RoutePath, key: string): Map<string, number> {
    const grouped = new Map<string, number>();
    for (let [from, to, value] of routePath.details[key]) {
      const distance = this.distanceBetweenPoints(routePath, from, to);
      const before = grouped.has(value) ? grouped.get(value) : 0;
      grouped.set(value, before + distance);
    }
    return grouped;
  }

  aggregatePathDetails(key: string): Map<string, number> {
    return this.paths().map(p => this.detailDistanceByValue(p, key)).reduce(
      (prev, cur) => {
        for (let [val, dist] of cur) {
          const before = prev.has(val) ? prev.get(val) : 0;
          prev.set(val, before + dist);
        }
        return prev;
      }, new Map<string, number>()
    );
  }

  computeStats() {
    return {
      'distance': this.paths().map(p => p.distance).reduce((p, c) => p + c, 0),
      'time': this.paths().map(p => p.time).reduce((p, c) => p + c, 0),
      'surface': [...this.aggregatePathDetails('surface').entries()].sort(([s1, d1], [s2, d2]) => d1 < d2 ? 1 : -1),
    }
  }
}

