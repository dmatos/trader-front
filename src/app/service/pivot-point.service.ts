import {Injectable} from "@angular/core";
import {of} from "rxjs";
import {ResponseModel} from "../model/response.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {PivotPointModel} from "../model/pivot-point.model";

@Injectable({providedIn: "root"})
export class PivotPointService{
  constructor(private httpClient:HttpClient) {
  }
  getStandardPivotPoint(
    stockExchangeCode: string,
    tickerCode: string,
    begin: string,
    end: string
  ){
    if(!tickerCode || !stockExchangeCode){
      return of(Error('Either tickerCode or stockExchange is not defined.'));
    }
    return this.httpClient.post<ResponseModel>(environment.apiUrl+`/intraday/metadata/pivot-point/standard`,
      {
        "stockExchangeCode": stockExchangeCode,
        "tickerCode": tickerCode,
        "begin": begin,
        "end": end
      }
    ).pipe(map((response) =>{
        if(!!response && response.status === 'OK' && response.data)
          return response.data as PivotPointModel;
        return new Error(response.data);
      }
    ));
  }
}
