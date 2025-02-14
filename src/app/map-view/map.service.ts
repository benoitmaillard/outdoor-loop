import { Injectable, signal } from '@angular/core';
import { zip } from 'rxjs';
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

  constructor(
    private graphhopperService: GraphHopperService
  ) { }

  addWayPoint(waypoint: Point) {
    if (this.waypoints().length > 0) {
      const last = this.waypoints().at(-1);
      
      // TODO we have to handle the 400 bad request error in case there is no suitable point nearby
      // TODO we should also probably update the point to the snapped point
      this.graphhopperService.computePath([last, waypoint]).subscribe(
        newPath => this.paths.update(old => [...old, newPath])
      )
    }
    this.waypoints.update(old => [...old, waypoint]);
  }

  removeWayPoint(index: number) {
    const oldLength = this.waypoints().length;
    this.waypoints.update(old => [...old.slice(0, index), ...old.slice(index+1, old.length)]);
    
    if (index == 0) {
      this.paths.update(old => old.slice(1, old.length));
    } else if (index == oldLength - 1) {
      this.paths.update(old => old.slice(0, old.length - 1));
    } else {
      // TODO we should probably have a mechanism to avoid inconsistencies after an API call (lock? index table? linkedlist?)
      this.graphhopperService.computePath([this.waypoints()[index - 1], this.waypoints()[index]]).subscribe(
        newPath => this.paths.update(old => [...old.slice(0, index - 1), newPath, ...old.slice(index + 1, old.length)])
      )
    }    
  }

  moveWayPoint(replacement: Point, index: number) {
    this.waypoints.update(old => [...old.slice(0, index), replacement, ...old.slice(index+1, old.length)]);

    if (index == 0) {
      this.graphhopperService.computePath([replacement, this.waypoints()[index + 1]])
        .subscribe(newPath => this.paths.update(old => [newPath, ...old.slice(index + 1, old.length)]));
    } else if (index == this.waypoints().length - 1) {
      this.graphhopperService.computePath([this.waypoints()[index - 1], replacement])
        .subscribe(newPath => this.paths.update(old => [...old.slice(0, index - 1), newPath]));
    } else {
      zip(
        this.graphhopperService.computePath([this.waypoints()[index - 1], replacement]),
        this.graphhopperService.computePath([replacement, this.waypoints()[index + 1]])
      ).subscribe(newPaths => this.paths.update(old => [...old.slice(0, index - 1), ...newPaths, ...old.slice(index + 1, old.length)]))
    }
  }
}