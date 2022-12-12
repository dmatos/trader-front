import {Injectable} from "@angular/core";
import {ResponseModel} from "../model/response.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {MovingAveragesResponseModel} from "../model/moving-average.model";

@Injectable({providedIn: 'root'})
export class EmaService {
  constructor(private httpClient: HttpClient) {
  }

  getExponentialMovingAverageByTickerCodeAndDateRange(tickerCode: string, stockExchangeCode: string, begin: string, end: string, durationInMinutes: number) {
    return this.httpClient.post<ResponseModel>(environment.apiUrl + '/intraday/metadata/ma/ema/' + stockExchangeCode,
      {
        "tickerCode": tickerCode,
        "begin": begin,
        "end": end,
        "size": durationInMinutes
      })
      .pipe(map((response) =>{
          if(response && response.data)
            return response.data as MovingAveragesResponseModel;
          else
            return new Error(response.data);
        }
      ));
  }

}
