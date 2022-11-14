import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlotterComponent } from './plotter/plotter.component';
import { TickersListComponent } from './tickers-list/tickers-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PlotterComponent,
    TickersListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
