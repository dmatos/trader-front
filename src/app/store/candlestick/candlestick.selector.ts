import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CandlestickState} from "./candlestick.state";
import {candlestickFeatureKey} from "./candlestick.reducer";

export const selectCandlestickState = createFeatureSelector<CandlestickState>(
  candlestickFeatureKey
);

export const selectCandlestick = createSelector(
  selectCandlestickState,
  (state: CandlestickState) => state.candlestick
);
