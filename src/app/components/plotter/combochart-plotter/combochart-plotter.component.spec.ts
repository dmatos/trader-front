import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombochartPlotterComponent } from './combochart-plotter.component';

describe('CombochartPlotterComponent', () => {
  let component: CombochartPlotterComponent;
  let fixture: ComponentFixture<CombochartPlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombochartPlotterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombochartPlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
