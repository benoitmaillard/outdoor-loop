import { Injectable, signal } from '@angular/core';
import { Route } from './route.model';
import { Node } from './node.model'
import { OverpassService } from './overpass.service';
import { RoutingService } from './routing.service';
import { Edge } from './edge.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public zoomLevel: number = 11;
  public center: [number, number] = [7.17, 46.64];
  public waypoints = signal<Node[]>([]);
  public edges = signal<Edge[][]>([])

  constructor(
    private overpassService: OverpassService,
    private routingService: RoutingService
  ) { }

  addWayPoint(waypoint: Node) {
    if (this.waypoints().length > 0) {
      const last = this.waypoints().at(-1);
      
      this.routingService.computePath(last, waypoint).subscribe(
        newEdges => this.edges.update(old => [...old, newEdges])
      )
    }
    this.waypoints.update(old => [...old, waypoint]);
  }
}