import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http"
import {Ticker} from "../model/ticker.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ResponseModel} from "../model/response.model";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class TickersService {

  constructor(private httpClient: HttpClient){
  }

  searchTickersByCode(code: string): Observable<Array<Ticker>>{
    return this.httpClient.get<ResponseModel>(environment.apiUrl+'/intraday/tickers/search/'+code)
      .pipe(map( (response) => response.data));
  }

  getAllTickers(): Observable<Array<Ticker>> {
    return this.httpClient.get<ResponseModel>(environment.apiUrl+'/intraday/tickers/search/_')
      .pipe(map( (response) => response.data));
  }
}
