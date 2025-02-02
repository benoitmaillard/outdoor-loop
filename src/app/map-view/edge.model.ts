import { Way } from "./way.model";
import { Node } from "./node.model";

export interface Edge {
  from: Node;
  to: Node;
  distance: number;
  way: Way; // TODO replace by actual ref to Way object
}