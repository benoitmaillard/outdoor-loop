import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, zip } from 'rxjs';
import { Node } from "./node.model"
import { Way } from './way.model';
import { sqrdEuclDist } from './utils';

@Injectable({
  providedIn: 'root'
})
export class OverpassService {
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  constructor(private http: HttpClient) { }

  getNearestRoadNode(lat: number, lon: number, radius: number = 200): Observable<Node> {
    const query = `[out:json];way["highway"](around:${radius}, ${lat}, ${lon});out geom;`;
    const response = this.http.get<OverpassResponse>(this.overpassUrl, {
      params: { data: query }
    });

    return response.pipe(
      map(response => response.elements as OverpassWay[]),
      map(ways => ways.flatMap(way => nodesOf(way))),
      map(nodes => nodes.length > 0 ? nodes.reduce((closest, node) =>
        sqrdEuclDist(lat, lon, node.lat, node.lon) <
          sqrdEuclDist(lat, lon, closest.lat, closest.lon)
          ? node
          : closest
      ) : null)
    )
  }

  // TODO should we return OverpassWay[] or Way[]? Maybe it lacks consistency
  getNearestWays(lat: number, lon: number, radius: number): Observable<OverpassWay[]> {
    const query = `[out:json];way["highway"](around:${radius}, ${lat}, ${lon});out geom;`;
    const response = this.http.get<OverpassResponse>(this.overpassUrl, {
      params: { data: query }
    });

    return response.pipe(
      map(response => response.elements as OverpassWay[])
    );
  }
}

function nodesOf(way: OverpassWay): Node[] {
  const nodes: Node[] = []
  for (let i = 0; i < way.nodes.length; i++) {
    const node = {
      id: way.nodes[i],
      lat: way.geometry[i].lat,
      lon: way.geometry[i].lon
    }
    nodes.push(node);
  }
  return nodes;
}

interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: (OverpassNode | OverpassWay)[];
}

interface OverpassNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: { [key: string]: string };
}

interface OverpassWay {
  type: 'way';
  id: number;
  nodes: number[];  // Node IDs that are part of the way
  tags?: { [key: string]: string };
  geometry: OverpassCoordinate[];  // Array of coordinates for the way
}

interface OverpassCoordinate {
  lat: number;
  lon: number;
}