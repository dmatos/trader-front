import {Ticker} from "../../model/ticker.model";

export interface TickersState{
  tickers: Ticker[],
  selectedTicker: Ticker
}
