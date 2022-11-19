import {createAction, props} from "@ngrx/store";
import {CandlestickState} from "./candlestick.state";

export const GET_CANDLESTICK_BY_TICKER_CODE_AND_DATE_RANGE_TYPE: string = "[Candlestick] Get candlestick by ticker code and date range";
export const GET_CANDLESTICK_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE: string = "[Candlestick] Get candlestick by ticker code and date range success";
export const GET_CANDLESTICK_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE: string = "[Candlestick] Get candlestick by ticker code and date range fail";

export const  getCandlestick = createAction(
  GET_CANDLESTICK_BY_TICKER_CODE_AND_DATE_RANGE_TYPE
);
export const getCandlestickSuccess = createAction(
  GET_CANDLESTICK_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  props<CandlestickState>()
);
export const getCandlestickFail = createAction(
  GET_CANDLESTICK_BY_TICKER_CODE_AND_DATE_RANGE_FAIL_TYPE,
  props<{error: any}>()
);
