import {createAction, props} from "@ngrx/store";
import {ChartState} from "./chart.state";

export const GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_TYPE: string = "[Chart] Get combochart candlestick+ema by ticker code and date range";
export const GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE: string = "[Chart] Get combochart candlestick+ema by ticker code and date range success";
export const GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE: string = "[Chart] Get combochart candlestick+ema by ticker code and date range fail";
export const GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_TYPE: string = "[Chart] Get combochart MACD+signal by ticker code and date range";
export const GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE: string = "[Chart] Get combochart MACD+signal by ticker code and date range success";
export const GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE: string = "[Chart] Get combochart MACD+signal by ticker code and date range fail";
export const GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_TYPE: string = "[Chart] Get  histogram of volume";
export const GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE: string = "[Chart] Get  histogram of volume success";
export const GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE: string = "[Chart] Get  histogram of volume fail";

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
  props<{
    error: Error
  }>()
);

export const getVolumeHistogram = createAction(
  GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_TYPE,
  props<{
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    duration: number
  }>()
);

export const getVolumeHistogramSuccess = createAction(
  GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  props<ChartState>()
);

export const getVolumeHistogramFail = createAction(
  GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE,
  props<{
    error: Error
  }>()
);

export const getMacdAndSignal = createAction(
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_TYPE,
  props<{
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    duration1: number,
    duration2: number,
    signalDuration: number
  }>()
);

export const getMacdAndSignalSuccess = createAction(
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  props<ChartState>()
);

export const getMacdAndSignalFail = createAction(
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE,
  props<{
    error: Error
  }>()
);
