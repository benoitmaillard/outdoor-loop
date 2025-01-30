import { Injectable } from '@angular/core';
import { Edge } from "./edge.model";
import { Node } from "./node.model"

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  // TODO keeps portion of the graph in memory, handles request to overpass API, uses Graphology
  constructor() { }

  async computePath(source: Node, target: Node): Promise<Edge[]> {
    return undefined;
  }
}
