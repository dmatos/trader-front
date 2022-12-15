import {ActionReducerMap} from "@ngrx/store";
import {TickersState} from "./tickers/tickers-list.state";
import {tickersReducer} from "./tickers/tickers-list.reducer";
import {ChartState} from "./chart/chart.state";
import {chartReducer} from "./chart/chart.reducer";

interface AppState {
  tickersState: TickersState;
  selectCandlestickWithEmaFeature: ChartState;
}

export const reducers: ActionReducerMap<AppState> = {
  tickersState: tickersReducer,
  selectCandlestickWithEmaFeature: chartReducer
};
