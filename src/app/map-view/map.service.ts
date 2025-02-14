import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, filter, Observable, Subject, throwError, zip } from 'rxjs';
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
  public paths = signal<RoutePath[]>([])
  private error = new Subject<string>();
  public errorStream = this.error.asObservable();

  constructor(
    private graphhopperService: GraphHopperService
  ) { }

  addWayPoint(waypoint: Point) {
    // TODO we should also probably update the point to the snapped point
    if (this.waypoints().length > 0) {
      this.computePath(this.waypoints().at(-1), waypoint).subscribe(
        newPath => {
          this.paths.update(old => [...old, newPath]);
          this.waypoints.update(old => [...old, waypoint]);
        }
      )
    } else {
      // we have to make a request to make sure this is a valid position
      this.computePath(waypoint, waypoint).subscribe(
        _ => this.waypoints.update(old => [...old, waypoint])
      )
    }
  }

  removeWayPoint(index: number) {
    const oldLength = this.waypoints().length;
    this.waypoints.update(old => [...old.slice(0, index), ...old.slice(index + 1, old.length)]);

    if (index == 0) {
      this.paths.update(old => old.slice(1, old.length));
    } else if (index == oldLength - 1) {
      this.paths.update(old => old.slice(0, old.length - 1));
    } else {
      // TODO we should probably have a mechanism to avoid inconsistencies after an API call (lock? index table? linkedlist?)
      this.computePath(this.waypoints()[index - 1], this.waypoints()[index]).subscribe(
        newPath => this.paths.update(old => [...old.slice(0, index - 1), newPath, ...old.slice(index + 1, old.length)])
      )
    }
  }

  moveWayPoint(replacement: Point, index: number) {
    const saveLat = this.waypoints()[index].lat;
    const saveLon = this.waypoints()[index].lon;
    this.waypoints()[index].lat = replacement.lat;
    this.waypoints()[index].lon = replacement.lon;

    if (index == 0) {
      this.computePath(replacement, this.waypoints()[index + 1])
        .subscribe({
          next: newPath => {
            this.paths.update(old => [newPath, ...old.slice(index + 1, old.length)]);
            this.waypoints.update(old => [...old.slice(0, index), replacement, ...old.slice(index + 1, old.length)]);
          },
          error: err => {
            this.waypoints()[index].lat = saveLat
            this.waypoints()[index].lon = saveLon
          }
        });
    } else if (index == this.waypoints().length - 1) {
      this.computePath(this.waypoints()[index - 1], replacement)
        .subscribe({
          next: newPath => {
            this.paths.update(old => [...old.slice(0, index - 1), newPath]);
            this.waypoints.update(old => [...old.slice(0, index), replacement, ...old.slice(index + 1, old.length)]);
          },
          error: err => {
            this.waypoints()[index].lat = saveLat
            this.waypoints()[index].lon = saveLon
          }
        });
    } else {
      zip(
        this.computePath(this.waypoints()[index - 1], replacement),
        this.computePath(replacement, this.waypoints()[index + 1])
      ).subscribe({
        next: newPaths => {
          this.paths.update(old => [...old.slice(0, index - 1), ...newPaths, ...old.slice(index + 1, old.length)]);
          this.waypoints.update(old => [...old.slice(0, index), replacement, ...old.slice(index + 1, old.length)]);
        },
        error: err => {
          this.waypoints()[index].lat = saveLat
          this.waypoints()[index].lon = saveLon
        }
      });
    }
  }

  computePath(from: Point, target: Point): Observable<RoutePath> {
    return this.graphhopperService.computePath([from, target]).pipe(
      catchError(error => {
        console.log("Bad point!!") // TODO replace with an error message
        return throwError(() => error);
      })
    )
  }
}