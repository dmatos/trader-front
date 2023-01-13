import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ResponseModel} from "../model/response.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {of} from "rxjs";

@Injectable({providedIn: 'root'})
export class StockQuotesService{
  constructor(private httpClient: HttpClient) {}

  getVolumeHistogramWithMeanPrice(tickerCode: string, stockExchangeCode: string, begin: string, end: string, durationInMinutes: number){
    if(!!stockExchangeCode) {
      return this.httpClient.post<ResponseModel>(environment.apiUrl + '/intraday/stockquotes/' + stockExchangeCode,
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
