import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandlestickPlotterComponent } from './candlestick-plotter.component';

describe('CandlestickPlotterComponent', () => {
  let component: CandlestickPlotterComponent;
  let fixture: ComponentFixture<CandlestickPlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandlestickPlotterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandlestickPlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
