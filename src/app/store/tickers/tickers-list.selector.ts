import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TickersState} from "./tickers-list.state";

export const tickersFeatureKey = 'tickersState';

export const selectTickersFeatureSelector = createFeatureSelector<TickersState>(
  tickersFeatureKey
);

export const selectTickers = createSelector(
  selectTickersFeatureSelector,
  (state: TickersState) => state
);
