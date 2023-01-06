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
import {GoogleChartsModule} from "angular-google-charts";
import {FormsModule} from "@angular/forms";
import {reducers} from "./store/index";
import {ChartComponent} from "./components/plotter/chart/chart.component";
import {ChartDirective} from "./components/plotter/chart/chart.directive";
import {ChartEffects} from "./store/chart/chart.effects";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./store/app-routes.routes";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SettingsComponent} from './components/plotter/chart/settings/settings.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCommonModule} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    PlotterComponent,
    TickersListComponent,
    ChartComponent,
    ChartDirective,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GoogleChartsModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCommonModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TickersListEffects, ChartEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
