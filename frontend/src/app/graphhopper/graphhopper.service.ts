import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RoutePath } from './route-path.model';
import { GraphHopperResponse } from './graphhopper-response.model';
import { environment } from '../../environments/environment';
import { Point } from '../map-view/point.model';

@Injectable({
  providedIn: 'root'
})
export class GraphHopperService {
  constructor(private http: HttpClient) { }
  
  computePath(waypoints: Point[], profile='car'): Observable<RoutePath> {
    let params = new HttpParams()
      .set('profile', profile)
      .set('format', 'json')
      .set('points_encoded', false)
      .set('ch.disable', true) // does not work with other profiles than car by default
      .append('details', 'road_class')
      .append('details', 'surface')
    
    for (let point of waypoints) {
      params = params.append('point', `${point.lat},${point.lon}`)
    }

    const response = this.http.get<GraphHopperResponse>(environment.routingApiUrl, {
      params: params
    });

    // we only return the first paths for now
    return response.pipe(
      map(r => r.paths[0])
    )
  }
}
