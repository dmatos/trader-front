import {createAction, props} from "@ngrx/store";
import {ChartState} from "./chart.state";

export const GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_TYPE: string = "[Chart] Get combochart candlestick+ema by ticker code and date range";
export const GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE: string = "[Chart] Get combochart candlestick+ema by ticker code and date range";
export const GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE: string = "[Chart] Get combochart candlestick+ema by ticker code and date range";

export const getCandlestickAndEma = createAction(
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_TYPE,
  props<{
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    duration: number
  }>()
);

export const getCandlestickAndEmaSuccess = createAction(
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  props<ChartState>()
);

export const getCandlestickAndEmaFail = createAction(
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE,
  props<{error: any}>()
);
