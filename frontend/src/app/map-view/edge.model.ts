import { Way } from "./way.model";
import { Point } from "./point.model";

export interface Edge {
  from: Point;
  to: Point;
  distance: number;
  way: Way; // TODO replace by actual ref to Way object
}