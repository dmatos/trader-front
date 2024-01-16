import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PlotterComponent} from './components/plotter/plotter.component';
import {TickersListComponent} from './components/tickers-list/tickers-list.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from '@ngrx/effects';
import {TickersListEffects} from "./store/tickers/tickers-list.effects";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {NgChartsModule} from "ng2-charts";
import {FormsModule} from "@angular/forms";
import {reducers} from "./store/index";
import {SettingsEffects} from "./store/settings/settings.effects";
import {ChartEffects} from "./store/chart/chart.effects";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./store/app-routes.routes";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SettingsComponent} from './components/plotter/settings/settings.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCommonModule, MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from "@angular/material/card";
import { CandlestickComponent } from './components/plotter/candlestick/candlestick.component';
import { MacdComponent } from './components/plotter/macd/macd.component';
import {MatSliderModule} from '@angular/material/slider';
import { DownloadCsvComponent } from './components/plotter/download-csv/download-csv.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgApexchartsModule} from "ng-apexcharts";
import {RsiComponent} from "./components/plotter/rsi/rsi.component";

@NgModule({
  declarations: [
    AppComponent,
    PlotterComponent,
    TickersListComponent,
    SettingsComponent,
    CandlestickComponent,
    MacdComponent,
    DownloadCsvComponent,
    RsiComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCommonModule,
    MatDividerModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatSliderModule,
    NgApexchartsModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TickersListEffects, ChartEffects, SettingsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
