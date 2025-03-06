import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './../map-view/map.service';
import { DistancePipe } from './distance.pipe';
import { TimePipe } from './time.pipe';
import { SurfacePipe } from './surface.pipe';
import { SurfaceColorPipe } from './surface-color.pip';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-route-panel',
  imports: [CommonModule, DistancePipe, TimePipe, SurfacePipe, SurfaceColorPipe, FormsModule],
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

  selectProfile(event: Event) {
    this.mapService.recomputePaths();
  }
}
