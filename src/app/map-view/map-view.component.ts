import { Component } from '@angular/core';
import { EventData, MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import {
  MapMouseEvent,
  RasterLayerSpecification,
  RasterSourceSpecification,
  StyleSpecification,
} from 'maplibre-gl';
import { MapService } from './map.service';
import { OverpassService } from './overpass.service';

@Component({
  selector: 'app-map-view',
  imports: [MapComponent, MarkerComponent],
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
    this.overpassService
      .getNearestRoadNode(event.lngLat.lat, event.lngLat.lng)
      .subscribe(node => {
        if (node)
          this.mapService.addWayPoint(node); 
        
        // TODO if there is no node nearby, we should display an warning message
      });
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
