export interface GeoJSONLineString {
  type: "LineString";
  coordinates: [number, number][]; // this is longitude, latitude!
}