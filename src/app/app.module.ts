import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlotterComponent } from './components/plotter/plotter.component';
import { TickersListComponent } from './components/tickers-list/tickers-list.component';
import { StoreModule } from "@ngrx/store";
import {tickersReducer} from "./store/tickers/tickers-list.reducer";
import { EffectsModule } from '@ngrx/effects';
import {TickersListEffects} from "./store/tickers/tickers-list.effects";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {HttpClientModule} from "@angular/common/http";
import {GoogleChartsModule} from "angular-google-charts";
import { CandlestickPlotterComponent } from './components/plotter/candlestick-plotter/candlestick-plotter.component';
import {PiechartPlotterComponent} from "./components/plotter/piechart-plotter/piechart-plotter.component";
import { CombochartPlotterComponent } from './components/plotter/combochart-plotter/combochart-plotter.component';
import {CandlestickEffects} from "./store/candlestick/candlestick.effects";
import {candlestickReducer} from "./store/candlestick/candlestick.reducer";
import {reducers} from "./store";

@NgModule({
  declarations: [
    AppComponent,
    PlotterComponent,
    TickersListComponent,
    CandlestickPlotterComponent,
    PiechartPlotterComponent,
    CombochartPlotterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GoogleChartsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TickersListEffects, CandlestickEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
