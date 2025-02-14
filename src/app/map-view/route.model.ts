import { Edge } from "./edge.model";
import { Point } from "./point.model"

export class Route {
  waypoints: Point[] = [];
  path: Edge[][] = [];

  // TODO add method to compute length, surface, elevation, etc
}