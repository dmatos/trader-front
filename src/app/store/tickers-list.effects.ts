import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {TickersService} from "../service/tickers.service";
import {
  getAllTickers,
  getAllTickersFail,
  getAllTickersSuccess,
  searchTickersByCode,
  searchTickersByCodeSuccess,
} from "./tickers-list.actions";
import {catchError, concatMap, map, mergeMap, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";

@Injectable()
export class TickersListEffects {

  getAllTickers$ = createEffect((): Observable<Action> =>
    this.actions$.pipe(
      ofType(getAllTickers),
      mergeMap(() => this.tickersService.getAllTickers().pipe(
        map(tickers => {
          return getAllTickersSuccess({tickers: tickers});
        }),
        catchError(error => of(getAllTickersFail({error: error})))
      ))
    )
  );

  //TODO not working yet
  searchTickersByCode$ = createEffect((): Observable<Action> =>
    this.actions$.pipe(
      ofType(searchTickersByCode),
      concatMap(({code}) => this.tickersService.searchTickersByCode(code).pipe(
        map(tickers => searchTickersByCodeSuccess({tickers: tickers})),
        catchError(error => of(getAllTickersFail({error: error})))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private tickersService: TickersService
  ) {
  }
}
