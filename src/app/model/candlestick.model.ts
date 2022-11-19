import {CandleModel} from "./candle.model";

export class CandlestickModel {
  constructor(public tickerCode: string, public stockExchangeCode: string, public candles: CandleModel[]) {
  }
}
