import {createReducer, on} from "@ngrx/store";
import {Ticker} from "../model/ticker.model";
import * as TickersListActions from "./tickers-list.actions";

export const tickersFeatureKey = 'tickers';

export interface TickersState{
  tickers: Ticker[]
}

export const initialState: TickersState = {tickers: []};

export const tickersReducer = createReducer(
  initialState,
  on(TickersListActions.getAllTickers, (state) => state),
  on(TickersListActions.getAllTickersSuccess, (state: TickersState, {tickers}) =>
    ({...state,
      tickers: tickers
    })
  ),
  on(TickersListActions.searchTickersByCode, (state) => state),
  on(TickersListActions.searchTickersByCodeSuccess, (state: TickersState, {tickers}) =>
    ({...state,
      tickers: tickers
    })
  ),
);
