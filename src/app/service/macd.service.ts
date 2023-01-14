import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {ResponseModel} from "../model/response.model";
import {MacdResponseModel} from "../model/macd.model";
import {of} from "rxjs";

@Injectable({providedIn: 'root'})
export class MacdService{
  constructor(private httpClient: HttpClient) {}
  getMacdByTickerCodeAndDateRange(
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    timeframeInMinutes1: number,
    timeframeInMinutes2: number,
    signaltimeframe: number,
  ){
    if(!tickerCode || !stockExchangeCode){
      return of(Error('Either tickerCode or stockExchange is not defined.'));
    }
    if(!timeframeInMinutes1 || !timeframeInMinutes2 || !signaltimeframe){
      return of(Error('Either timeframes or signal is not defined'));
    }
    return this.httpClient.post<ResponseModel>(environment.apiUrl+`/intraday/metadata/ma/macd/${stockExchangeCode}/${timeframeInMinutes1}/${timeframeInMinutes2}/${signaltimeframe}`,
      {
        "tickerCode": tickerCode,
        "begin": begin,
        "end": end,
        "timeframe": 0
      }
    ).pipe(map((response) =>{
        if(!!response && response.status === 'OK' && response.data)
          return response.data as MacdResponseModel;
        return new Error(response.data);
      }
    ));
  }
}
