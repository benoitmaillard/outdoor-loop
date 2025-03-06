import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'surfaceColor',
})
export class SurfaceColorPipe implements PipeTransform {
  transform(value: number): string {
    /* 
    tailwind only generates these classes it if detects them in full in the source code,
    so we cannot generate them programmatically
    */
    const colorsWebkit = [
      '[&::-webkit-progress-value]:bg-yellow-500',
      '[&::-webkit-progress-value]:bg-green-500',
      '[&::-webkit-progress-value]:bg-gray-500',
      '[&::-webkit-progress-value]:bg-stone-500',
      '[&::-webkit-progress-value]:bg-yellow-600',
      '[&::-webkit-progress-value]:bg-green-600',
      '[&::-webkit-progress-value]:bg-gray-600',
      '[&::-webkit-progress-value]:bg-stone-600',
      '[&::-webkit-progress-value]:bg-yellow-700',
      '[&::-webkit-progress-value]:bg-green-700',
      '[&::-webkit-progress-value]:bg-gray-700',
      '[&::-webkit-progress-value]:bg-stone-700',
      '[&::-webkit-progress-value]:bg-yellow-800',
      '[&::-webkit-progress-value]:bg-green-800',
      '[&::-webkit-progress-value]:bg-gray-800',
      '[&::-webkit-progress-value]:bg-stone-800',
      '[&::-webkit-progress-value]:bg-yellow-900',
      '[&::-webkit-progress-value]:bg-green-900',
      '[&::-webkit-progress-value]:bg-gray-900',
      '[&::-webkit-progress-value]:bg-stone-900',
    ]

    const colorsMoz = [
      '[&::-moz-progress-bar]:bg-yellow-500',
      '[&::-moz-progress-bar]:bg-green-500',
      '[&::-moz-progress-bar]:bg-gray-500',
      '[&::-moz-progress-bar]:bg-stone-500',
      '[&::-moz-progress-bar]:bg-yellow-600',
      '[&::-moz-progress-bar]:bg-green-600',
      '[&::-moz-progress-bar]:bg-gray-600',
      '[&::-moz-progress-bar]:bg-stone-600',
      '[&::-moz-progress-bar]:bg-yellow-700',
      '[&::-moz-progress-bar]:bg-green-700',
      '[&::-moz-progress-bar]:bg-gray-700',
      '[&::-moz-progress-bar]:bg-stone-700',
      '[&::-moz-progress-bar]:bg-yellow-800',
      '[&::-moz-progress-bar]:bg-green-800',
      '[&::-moz-progress-bar]:bg-gray-800',
      '[&::-moz-progress-bar]:bg-stone-800',
      '[&::-moz-progress-bar]:bg-yellow-900',
      '[&::-moz-progress-bar]:bg-green-900',
      '[&::-moz-progress-bar]:bg-gray-900',
      '[&::-moz-progress-bar]:bg-stone-900',
    ]
    return `progress ${colorsWebkit[value]} ${colorsMoz[value]}`;
  }
}









