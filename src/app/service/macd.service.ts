import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {ResponseModel} from "../model/response.model";
import {MacdResponseModel} from "../model/macd.model";

@Injectable({providedIn: 'root'})
export class MacdService{
  constructor(private httpClient: HttpClient) {}
  getMacdByTickerCodeAndDateRange(
    tickerCode: string,
    stockExchangeCode: string,
    begin: string,
    end: string,
    durationInMinutes1: number,
    durationInMinutes2: number,
    signalDuration: number,
  ){
    return this.httpClient.post<ResponseModel>(environment.apiUrl+`/macd/${stockExchangeCode}/${durationInMinutes1}/${durationInMinutes2}/${signalDuration}`,
      {
        "tickerCode": tickerCode,
        "begin": begin,
        "end": end,
        "size": 0
      }
    ).pipe(map((response) =>{
        if(response && response.data)
          return response.data as MacdResponseModel;
        else
          return new Error(response.data);
      }
    ));
  }
}
