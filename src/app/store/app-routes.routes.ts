import {Routes} from "@angular/router";
import {PlotterComponent} from "../components/plotter/plotter.component";
import {TickersListComponent} from "../components/tickers-list/tickers-list.component";

export const appRoutes: Routes = [
  {path: '', component: TickersListComponent},
  {path: ':stockExchangeCode/:tickerCode', component: TickersListComponent},
  {path: ':stockExchangeCode/:tickerCode', outlet: 'plotter', component: PlotterComponent}

]
