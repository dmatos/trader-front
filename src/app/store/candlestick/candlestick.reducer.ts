import {CandlestickState} from "./candlestick.state";
import {createReducer, on} from "@ngrx/store";
import * as CandlestickActions from "./candlestick.actions";

export const candlestickFeatureKey = 'candlestickState';

export const initialState: CandlestickState = {candlestick: {candles: [], tickerCode: '', stockExchangeCode: ''}};

export const candlestickReducer = createReducer(
  initialState,
  on(CandlestickActions.getCandlestick, (state) => state),
  on(CandlestickActions.getCandlestickSuccess, (state: CandlestickState, {candlestick}) =>
    ({
      ...state,
      candlestick: candlestick
    })
  )
);
