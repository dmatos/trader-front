import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {TickersService} from "../../service/tickers.service";
import {
  getAllTickers,
  getAllTickersFail,
  getAllTickersSuccess,
  searchTickersByCode,
  searchTickersByCodeSuccess,
  selectTicker,
  selectTickerFail,
} from "./tickers-list.actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {Ticker} from "../../model/ticker.model";
import {getCandlestickAndEma, getCandlestickAndEmaFail, getMacdAndSignal} from "../chart/chart.actions";

@Injectable()
export class TickersListEffects {

  getAllTickers$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(getAllTickers),
      mergeMap(() => this.tickersService.getAllTickers().pipe(
        map(tickers => {
          return getAllTickersSuccess({tickers: tickers, selectedTicker: tickers.length>0?tickers[0]:new Ticker('',0,'','')});
        }),
        catchError(error => of(getAllTickersFail({error: error})))
      ))
    )
  );

  searchTickersByCode$ = createEffect((): Observable<any> =>
    this.actions$.pipe(
      ofType(searchTickersByCode),
      mergeMap(({code}) => this.tickersService.searchTickersByCode(code).pipe(
        map(tickers => searchTickersByCodeSuccess({tickers: tickers, selectedTicker: tickers.length>0?tickers[0]:new Ticker('',0,'','')})),
        catchError(error => of(getAllTickersFail({error: error})))
      ))
    )
  );

  selectTicker$ = createEffect(() : Observable<any> =>
    this.actions$.pipe(
      ofType(selectTicker),
      map(({ tickerCode, stockExchangeCode, begin, end, timeframe}) => getCandlestickAndEma({tickerCode, stockExchangeCode, begin, end, timeframe})),
      catchError( error => of(selectTickerFail({error: error})))
    )
  );

  selectTickerFail$ = createEffect(() : Observable<any> =>
    this.actions$.pipe(
      ofType(selectTickerFail),
      map(({ error }) => getCandlestickAndEmaFail({error})),
      catchError( error => of(selectTickerFail({error: error})))
    )
  );

  constructor(
    private actions$: Actions,
    private tickersService: TickersService
  ) {
  }
}
