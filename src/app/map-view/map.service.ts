import { Injectable } from '@angular/core';
import { Route } from './route.model';
import { Node } from './node.model'
import { OverpassService } from './overpass.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public zoomLevel: number = 11;
  public center: [number, number] = [7.17, 46.64];
  public route: Route = new Route();

  constructor(private overpassService: OverpassService) { }

  addWayPoint(waypoint: Node) {
    this.route.waypoints.push(waypoint);
  }
}