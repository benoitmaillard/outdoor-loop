import { Injectable, signal } from '@angular/core';
import { Route } from './route.model';
import { Node } from './node.model'
import { OverpassService } from './overpass.service';
import { RoutingService } from './routing.service';
import { Edge } from './edge.model';
import { zip } from 'rxjs';

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

  removeWayPoint(index: number) {
    const oldLength = this.waypoints().length;
    this.waypoints.update(old => [...old.slice(0, index), ...old.slice(index+1, old.length)]);
    
    if (index == 0) {
      this.edges.update(old => old.slice(1, old.length));
    } else if (index == oldLength - 1) {
      this.edges.update(old => old.slice(0, old.length - 1));
    } else {
      // TODO we should probably have a mechanism to avoid inconsistencies after an API call (lock? index table? linkedlist?)
      this.routingService.computePath(this.waypoints()[index - 1], this.waypoints()[index]).subscribe(
        newEdges => this.edges.update(old => [...old.slice(0, index - 1), newEdges, ...old.slice(index + 1, old.length)])
      )
    }    
  }

  moveWayPoint(replacement: Node, index: number) {
    this.waypoints.update(old => [...old.slice(0, index), replacement, ...old.slice(index+1, old.length)]);

    if (index == 0) {
      this.routingService.computePath(replacement, this.waypoints()[index + 1])
        .subscribe(newEdges => this.edges.update(old => [newEdges, ...old.slice(index + 1, old.length)]));
    } else if (index == this.waypoints().length - 1) {
      this.routingService.computePath(this.waypoints()[index - 1], replacement)
        .subscribe(newEdges => this.edges.update(old => [...old.slice(0, index - 1), newEdges]));
    } else {
      zip(
        this.routingService.computePath(this.waypoints()[index - 1], replacement),
        this.routingService.computePath(replacement, this.waypoints()[index + 1])
      ).subscribe(res => this.edges.update(old => [...old.slice(0, index - 1), ...res, ...old.slice(index + 1, old.length)]))
    }
  }
}