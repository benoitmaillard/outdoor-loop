import { Component, computed, Input } from '@angular/core';
import { EventData, FeatureComponent, GeoJSONSourceComponent, LayerComponent, MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import {
  MapMouseEvent,
  Marker,
  RasterLayerSpecification,
  RasterSourceSpecification,
  StyleSpecification,
} from 'maplibre-gl';
import { MapService } from './map.service';
import { OverpassService } from './overpass.service';
import { Edge } from './edge.model';

@Component({
  selector: 'app-map-view',
  imports: [MapComponent, MarkerComponent, LayerComponent, GeoJSONSourceComponent, FeatureComponent],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent {
  style: string | StyleSpecification;

  constructor(
    public mapService: MapService,
    public overpassService: OverpassService
  ) {}

  ngOnInit() {
    this.initializeMapStyle();
  }

  onMapClick(event: MapMouseEvent & EventData) {
    this.mapService.addWayPoint({lat: event.lngLat.lat, lon: event.lngLat.lng})
  }

  onDragEnd(event: Marker, index: number) {
    this.mapService.moveWayPoint({lat: event.getLngLat().lat, lon: event.getLngLat().lng}, index)
  }

  coordinatesFromSubpath(edges: Edge[]): number[][] {
    return [
          [edges[0].from.lon, edges[0].from.lat],
          ...edges.map(e => [e.to.lon, e.to.lat])
        ]
  }

  initializeMapStyle() {
    // taken from https://github.com/maplibre/ngx-maplibre-gl/blob/main/projects/showcase/src/app/demo/examples/set-style.component.ts
    const source = {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      minzoom: 0,
      maxzoom: 18,
      scheme: 'xyz',
      tileSize: 256,
    } as RasterSourceSpecification;
    const layer = {
      id: 'some-raster-layer-id',
      type: 'raster',
      source: 'raster',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'raster-opacity': 1.0,
      },
    } as RasterLayerSpecification;

    this.style = {
      version: 8,
      sources: {
        raster: source,
      },
      layers: [layer],
    };
  }
}
