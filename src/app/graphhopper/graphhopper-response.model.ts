import { RoutePath } from "./route-path.model";

export interface GraphHopperResponse {
  paths: RoutePath[];
  info?: APIInfo;
}

export interface APIInfo {
  copyrights?: string[];
  took?: number;
}