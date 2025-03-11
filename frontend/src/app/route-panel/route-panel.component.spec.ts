import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePanelComponent } from './route-panel.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RoutePanelComponent', () => {
  let component: RoutePanelComponent;
  let fixture: ComponentFixture<RoutePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePanelComponent],
      providers: [
              provideHttpClient(),
              provideHttpClientTesting(),
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
