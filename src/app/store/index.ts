import {ActionReducerMap} from "@ngrx/store";
import {TickersState} from "./tickers/tickers-list.state";
import {CandlestickState} from "./candlestick/candlestick.state";
import {tickersReducer} from "./tickers/tickers-list.reducer";
import {candlestickReducer} from "./candlestick/candlestick.reducer";

interface AppState {
  tickersState: TickersState;
  candlestickState: CandlestickState;
}

export const reducers: ActionReducerMap<AppState> = {
  tickersState: tickersReducer,
  candlestickState: candlestickReducer
};
