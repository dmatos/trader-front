import {createAction, props} from "@ngrx/store";
import {TickersState} from "./tickers-list.state";
import {Ticker} from "../../model/ticker.model";
import {CandlestickModel} from "../../model/candlestick.model";

export const GET_ALL_TICKERS_TYPE: string = '[Ticker] Get tickers';
export const GET_ALL_TICKERS_SUCCESS_TYPE: string = '[Ticker] Get tickers success';
export const GET_ALL_TICKERS_FAIL_TYPE: string = '[Ticker] Get tickers fail';
export const SEARCH_TICKERS_BY_CODE_TYPE: string = '[Ticker] Search tickers by code';
export const SEARCH_TICKERS_BY_CODE_SUCCESS_TYPE: string = '[Ticker] Search tickers by code success';
export const SEARCH_TICKERS_BY_CODE_FAIL_TYPE: string = '[Ticker] Search tickers by code fail';
export const SELECT_TICKER_TYPE: string = '[Ticker] Select ticker';
export const SELECT_TICKER_SUCCESS_TYPE: string = '[Ticker] Select ticker success';
export const SELECT_TICKER_FAIL_TYPE: string = '[Ticker] Select ticker fail';

export const getAllTickers = createAction(GET_ALL_TICKERS_TYPE);
export const getAllTickersSuccess = createAction(
  GET_ALL_TICKERS_SUCCESS_TYPE,
  props<TickersState>()
);
export const getAllTickersFail = createAction(
  GET_ALL_TICKERS_FAIL_TYPE,
  props<{error: any}>()
);
export const searchTickersByCode = createAction(
  SEARCH_TICKERS_BY_CODE_TYPE,
  props<{code: string}>()
);
export const searchTickersByCodeSuccess = createAction(
  SEARCH_TICKERS_BY_CODE_SUCCESS_TYPE,
  props<TickersState>()
);
export const searchTickersByCodeFail = createAction(
  SEARCH_TICKERS_BY_CODE_FAIL_TYPE,
  props<{error: any}>()
);
export const selectTicker = createAction(
  SELECT_TICKER_TYPE,
  props<{
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    duration: number
  }>()
);
export const selectTickerSuccess = createAction(
  SELECT_TICKER_SUCCESS_TYPE
);
export const selectTickerFail = createAction(
  SELECT_TICKER_FAIL_TYPE,
  props<{error: any}>()
);
