import { Component } from '@angular/core';
import { MapViewComponent } from '../map-view/map-view.component';
import { RoutePanelComponent } from '../route-panel/route-panel.component';
import { ErrorDisplayComponent } from '../error-display/error-display.component';
import { MapService } from '../map-view/map.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-planner',
  imports: [MapViewComponent, RoutePanelComponent, ErrorDisplayComponent, RouterLink],
  templateUrl: './route-planner.component.html',
  styleUrl: './route-planner.component.css'
})
export class RoutePlannerComponent {
  constructor(public mapService: MapService) {}
}
