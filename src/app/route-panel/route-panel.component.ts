import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './../map-view/map.service';

@Component({
  selector: 'app-route-panel',
  imports: [CommonModule],
  templateUrl: './route-panel.component.html',
  styleUrl: './route-panel.component.css'
})
export class RoutePanelComponent {
  constructor(public mapService: MapService) {}

  zoomIn() {
    this.mapService.zoomLevel++;
  }

  zoomOut() {
    this.mapService.zoomLevel--;
  }

  removeWayPoint(index: number) {
    this.mapService.removeWayPoint(index);
  }
}
