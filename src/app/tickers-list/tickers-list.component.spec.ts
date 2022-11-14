import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickersListComponent } from './tickers-list.component';

describe('TickersListComponent', () => {
  let component: TickersListComponent;
  let fixture: ComponentFixture<TickersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TickersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
