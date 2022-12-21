import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ResponseModel} from "../model/response.model";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {of} from "rxjs";
import {CandlestickModel} from "../model/candlestick.model";
import {ChartState} from "../store/chart/chart.state";

@Injectable({providedIn: 'root'})
export class CandlestickService {
  constructor(private httpClient: HttpClient){
  }

  /**
   *
   * @param tickerCode
   * @param stockExchangeCode
   * @param begin like 2022-11-17T00:58:42.783Z
   * @param end like 2022-11-17T23:58:42.783Z
   * @param durationInMinutes number of ticks in the candle in minutes
   */
  getCandlestickByTickerCodeAndDateRange(tickerCode: string, stockExchangeCode: string, begin: string, end: string, durationInMinutes: number){
    if(!!stockExchangeCode) {
      return this.httpClient.post<ResponseModel>(environment.apiUrl + '/intraday/metadata/candlestick/' + stockExchangeCode,
        {
          "tickerCode": tickerCode,
          "begin": begin,
          "end": end,
          "chronoUnit": "MINUTES",
          "duration": durationInMinutes
        })
        .pipe(map((response) => {
          if( !!response && response.status === 'OK' && response.data)
            return response.data;
          return new Error(response.data);
        }));
    }
    return of(null);
  }
}
