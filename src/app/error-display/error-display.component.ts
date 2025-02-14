import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error-display',
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.css'
})
export class ErrorDisplayComponent {
  @Input() errorStream: Observable<string>
  errorQueue: string[] = []

  ngOnInit() {
    this.errorStream.subscribe(msg => {
      this.errorQueue.push(msg);

      setTimeout(() => {
        this.errorQueue = this.errorQueue.slice(1);
      }, 2000);
    });
  }
}
