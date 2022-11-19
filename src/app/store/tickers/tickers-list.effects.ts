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
} from "./tickers-list.actions";
import {catchError, concatMap, map, mergeMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {Ticker} from "../../model/ticker.model";
import {CandlestickService} from "../../service/candlestick.service";
import {getCandlestickSuccess} from "../candlestick/candlestick.actions";

@Injectable()
export class TickersListEffects {

  getAllTickers$ = createEffect((): Observable<Action> =>
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

  searchTickersByCode$ = createEffect((): Observable<Action> =>
    this.actions$.pipe(
      ofType(searchTickersByCode),
      concatMap(({code}) => this.tickersService.searchTickersByCode(code).pipe(
        map(tickers => searchTickersByCodeSuccess({tickers: tickers, selectedTicker: tickers.length>0?tickers[0]:new Ticker('',0,'','')})),
        catchError(error => of(getAllTickersFail({error: error})))
      ))
    )
  );

  selectTicker$ = createEffect(() : Observable<Action> =>
    this.actions$.pipe(
      ofType(selectTicker),
      concatMap( ({ tickerCode, stockExchangeCode, begin, end, duration}) =>
        this.candlestickService.getCandlestickByTickerCodeAndDateRange(tickerCode, stockExchangeCode, begin, end, duration).pipe(
          map( candlestick => getCandlestickSuccess({candlestick}))
        ) )
    )
  );

  constructor(
    private actions$: Actions,
    private tickersService: TickersService,
    private candlestickService: CandlestickService
  ) {
  }
}
