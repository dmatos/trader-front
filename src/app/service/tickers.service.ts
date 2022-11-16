import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http"
import {Ticker} from "../model/ticker.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ResponseModel} from "../model/response.model";

@Injectable({providedIn: 'root'})
export class TickersService {

  tickers: Ticker[];

  constructor(private httpClient: HttpClient){
    this.tickers = [];
  }

  searchTickersByCode(code: string): Observable<Array<Ticker>>{
    return this.httpClient.get<ResponseModel>('http://localhost:8080/intraday/tickers/search/'+code)
      .pipe(map( (response) => response.data));
  }

  getAllTickers(): Observable<Array<Ticker>> {
    return this.httpClient.get<ResponseModel>('http://localhost:8080/intraday/tickers/search/_')
      .pipe(map( (response) => response.data));
  }
}
