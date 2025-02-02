import { Injectable } from '@angular/core';
import { Edge } from "./edge.model";
import { Node } from "./node.model";
import Graph, { MultiUndirectedGraph } from 'graphology';
import { bidirectional, astar, dijkstra } from 'graphology-shortest-path';
import { OverpassService } from './overpass.service';
import { map, Observable } from 'rxjs';
import { euclDist, haversine, sqrdEuclDist } from './utils';
import { Way } from './way.model';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  // TODO keeps portion of the graph in memory, handles request to overpass API, uses Graphology
  constructor(private overpassService: OverpassService) { }

  computePath(source: Node, target: Node): Observable<Edge[]> {
    const distance = haversine(source.lat, source.lon, target.lat, target.lon);
    const response = this.overpassService.getNearestWays((source.lat + target.lat) / 2, (source.lon + target.lon) / 2, distance);

    // for node: [lat, lon], for edge: [distance, wayID]
    

    return response.pipe(
      map(ways => {
        const graph = new MultiUndirectedGraph<[number, number], [number, number]>();
        const wayMap = new Map<number, Way>();
        let edgeCount = 0;

        ways.forEach(way => {
          for (let i = 0; i < way.nodes.length; i++) {
            if (!graph.hasNode(way.nodes[i]))
              graph.addNode(way.nodes[i], [way.geometry[i].lat, way.geometry[i].lon]);
          }

          for (let i = 0; i < way.nodes.length - 1; i++) {
            const dist = haversine(way.geometry[i].lat, way.geometry[i].lon, way.geometry[i+1].lat, way.geometry[i+1].lon);
            graph.addEdgeWithKey(edgeCount++, way.nodes[i], way.nodes[i+1], [dist, way.id]);
          }
          
          wayMap.set(way.id, way);
        });

        console.log(graph.size);

        const nodes =  astar.bidirectional(
          graph,
          source.id.toString(), // Graphology needs a string for A-star, this is probably a bug
          target.id.toString(),
          (_, [distance, wayId]) => distance,
          (node, final) => {
            const n1 = graph.getNodeAttributes(node);
            const n2 = graph.getNodeAttributes(final);
            return euclDist(n1[0], n1[1], n2[0], n2[1]);
          }
        );

        const edges: Edge[] = [];
        let prevNode = source;
        for (let i = 0; i < nodes.length - 1; i++) {
          const id = graph.findEdge(nodes[i], nodes[i+1], (a, b) => true);
          const n2 = graph.getNodeAttributes(nodes[i+1]);
          const nextNode: Node = {id: parseInt(nodes[i+1]), lat: n2[0], lon: n2[1]};
          
          const [distance, wayID] = graph.getEdgeAttributes(id);
          const edge = {from: prevNode, to: nextNode, distance: distance, way: wayMap.get(wayID)}
          prevNode = nextNode;

          edges.push(edge);
        }

        return edges;
      })
    );
  }
}
