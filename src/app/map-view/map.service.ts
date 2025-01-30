import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private zoomLevel: number = 11;
  private center: [number, number] = [7.17, 46.64];

  getZoom(): number {
    return this.zoomLevel;
  }

  setZoom(zoom: number): void {
    this.zoomLevel = zoom;
  }

  getCenter(): [number, number] {
    return this.center;
  }

  setCenter(center: [number, number]): void {
    this.center = center;
  }
}