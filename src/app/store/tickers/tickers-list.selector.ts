import {createFeatureSelector, createSelector} from "@ngrx/store";
import {tickersFeatureKey} from "./tickers-list.reducer";
import {TickersState} from "./tickers-list.state";

export const selectTickersState = createFeatureSelector<TickersState>(
  tickersFeatureKey
);

export const selectTickers = createSelector(
  selectTickersState,
  (state: TickersState) => state.tickers
);
