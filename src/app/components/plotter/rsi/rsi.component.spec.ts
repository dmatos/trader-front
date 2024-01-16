import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsiComponent } from './rsi.component';

describe('RsiComponent', () => {
  let component: RsiComponent;
  let fixture: ComponentFixture<RsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
