import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacdComponent } from './macd.component';

describe('MacdComponent', () => {
  let component: MacdComponent;
  let fixture: ComponentFixture<MacdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
