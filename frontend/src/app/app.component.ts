import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewComponent } from "./map-view/map-view.component";
import { RoutePanelComponent } from "./route-panel/route-panel.component";
import { ErrorDisplayComponent } from "./error-display/error-display.component";
import { MapService } from './map-view/map.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapViewComponent, RoutePanelComponent, ErrorDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'outdoorloop';

  constructor(public mapService: MapService) {}
}
