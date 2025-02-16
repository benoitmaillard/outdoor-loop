import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'surface',
})
export class SurfacePipe implements PipeTransform {
  transform(value: string): string {
    const result = value.replace(/_/g, ' ');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}