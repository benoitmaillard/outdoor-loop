import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, filter, Observable, Subject, throwError, zip, map } from 'rxjs';
import { GraphHopperService } from '../graphhopper/graphhopper.service';
import { RoutePath } from '../graphhopper/route-path.model';
import { Point } from './point.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public zoomLevel: number = 11;
  public center: [number, number] = [7.17, 46.64];
  public waypoints = signal<Point[]>([]);
  public paths = signal<RoutePath[]>([]);
  private error = new Subject<string>();
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
}