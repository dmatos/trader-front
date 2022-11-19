import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartPlotterComponent } from './piechart-plotter.component';

describe('CandlestickPlotterComponent', () => {
  let component: PiechartPlotterComponent;
  let fixture: ComponentFixture<PiechartPlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiechartPlotterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiechartPlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
