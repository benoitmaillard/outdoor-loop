import { GeoJSONLineString } from "./geojson.model";
import { PathDetails } from "./path-details.model";
import { RouteInstruction } from "./route-instruction.model";

export interface RoutePath {
  distance: number;
  time: number;
  ascend?: number;
  descend?: number;
  points: GeoJSONLineString;
  snapped_waypoints?: GeoJSONLineString;
  instructions: RouteInstruction[];
  details?: PathDetails;
  bbox?: [number, number, number, number];
  points_encoded: boolean;
  encoded_polyline?: string;
}