import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapService } from './map-view/map.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'outdoorloop';

  constructor(public mapService: MapService) {}
}
