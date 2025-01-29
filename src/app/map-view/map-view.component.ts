import { Component } from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import {
  RasterLayerSpecification,
  RasterSourceSpecification,
  StyleSpecification,
} from 'maplibre-gl';

@Component({
  selector: 'app-map-view',
  imports: [MapComponent],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent {
  style: string | StyleSpecification;

  ngOnInit() {
    this.initializeMapStyle();
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
