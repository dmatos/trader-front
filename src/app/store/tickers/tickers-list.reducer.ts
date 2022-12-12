import {createReducer, on} from "@ngrx/store";
import * as TickersListActions from "./tickers-list.actions";
import {TickersState} from "./tickers-list.state";
import {Ticker} from "../../model/ticker.model";

export const initialState: TickersState = {tickers: [], selectedTicker: new Ticker('',0,'','')};

export const tickersReducer = createReducer(
  initialState,
  on(TickersListActions.getAllTickers, (state) => state),
  on(TickersListActions.getAllTickersSuccess, (state: TickersState, {tickers}) =>
    ({
      ...state,
      tickers: tickers
    })
  ),
  on(TickersListActions.searchTickersByCode, (state) => state),
  on(TickersListActions.searchTickersByCodeSuccess, (state: TickersState, {tickers}) =>
    ({
      ...state,
      tickers: tickers
    })
  ),
  on(TickersListActions.selectTicker, (state: TickersState, {tickerCode, stockExchangeCode}) =>
    ({
      ...state,
      selectedTicker: filterSelectedTicker(state.tickers, tickerCode, stockExchangeCode)
    })
  )
);

export function filterSelectedTicker(tickers: Ticker[], tickerCode: string, stockExchangeCode: string){
  const filteredTicker = tickers.filter(ticker => ticker.code == tickerCode && ticker.stockExchangeCode == stockExchangeCode);
  if(filteredTicker.length > 0)
    return filteredTicker[0];
  return tickers[0];
}
