import { Edge } from "./edge.model";
import { Node } from "./node.model"

export class Route {
  waypoints: Node[] = [];
  path: Edge[][] = [];

  // TODO add method to compute length, surface, elevation, etc
}