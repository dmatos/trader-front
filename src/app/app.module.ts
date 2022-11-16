import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlotterComponent } from './plotter/plotter.component';
import { TickersListComponent } from './tickers-list/tickers-list.component';
import { StoreModule } from "@ngrx/store";
import {tickersReducer} from "./store/tickers-list.reducer";
import { EffectsModule } from '@ngrx/effects';
import {TickersListEffects} from "./store/tickers-list.effects";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    PlotterComponent,
    TickersListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({tickers: tickersReducer}),
    EffectsModule.forRoot([TickersListEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
