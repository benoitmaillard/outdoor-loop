import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapViewComponent } from "./map-view/map-view.component";
import { RoutePanelComponent } from "./route-panel/route-panel.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapViewComponent, RoutePanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'outdoorloop';
}
