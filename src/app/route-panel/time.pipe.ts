import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number): string {
    const seconds = value / 1000;

    if (seconds > 3600) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.round((seconds - 3600 * hours) / 60);
        return `${hours} h ${minutes} m`
    } else if (seconds > 60) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} m ${Math.round((seconds - 60 * minutes))} s`
    } else {
        return `${Math.round(seconds)} s`;
    }
  }
}