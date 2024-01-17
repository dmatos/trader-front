import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {ResponseModel} from "../model/response.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {RsiResponseModel} from "../model/rsi.model";

@Injectable({providedIn: 'root'})
export class RsiService {
  constructor(private httpClient: HttpClient) {
  }

  getRsi(
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    timeframe: number,
    numberOfCandles: number
  ){
    if(!tickerCode || !stockExchangeCode){
      return of(Error('Either tickerCode or stockExchange is not defined.'));
    }
    if(!numberOfCandles || !timeframe){
      return of(Error('Either timeframes or numberOfCandles is not defined'));
    }
    return this.httpClient.post<ResponseModel>(environment.apiUrl+`/intraday/metadata/rsi/${stockExchangeCode}`,
      {
        "numberOfCandles": numberOfCandles,
        "candlestickRequestDTO": {
          "tickerCode": tickerCode,
          "begin": begin,
          "end": end,
          "chronoUnit": "MINUTES",
          "timeframe": timeframe
        },
      }
    ).pipe(map((response) =>{
        if(!!response && response.status === 'OK' && response.data)
          return response.data as RsiResponseModel;
        return new Error(response.data);
      }
    ));
  }
}
