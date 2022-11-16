import {createFeatureSelector, createSelector} from "@ngrx/store";
import {tickersFeatureKey, TickersState} from "./tickers-list.reducer";

export const selectTickersState = createFeatureSelector<TickersState>(
  tickersFeatureKey
);

export const selectTickers = createSelector(
  selectTickersState,
  (state: TickersState) => state.tickers
);
