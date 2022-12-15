import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CandlestickService} from "../../service/candlestick.service";
import {filter, mergeAll, Observable, of, switchAll, switchMap, take, takeLast, throwError} from "rxjs";
import {Action} from "@ngrx/store";
import {
  getCandlestickAndEma,
  getCandlestickAndEmaFail,
  getCandlestickAndEmaSuccess,
  getMacdAndSignal, getMacdAndSignalFail, getMacdAndSignalSuccess
} from "./chart.actions";
import {catchError, map, mergeMap} from "rxjs/operators";
import {EmaService} from "../../service/ema.service";
import {CandlestickModel} from "../../model/candlestick.model";
import {ChartDataModel} from "../../model/chart-data.model";
import {CandleModel} from "../../model/candle.model";
import {ChartState} from "./chart.state";
import {MacdService} from "../../service/macd.service";
import {MacdResponseModel} from "../../model/macd.model";

@Injectable()
export class ChartEffects{
  constructor(
    private actions$: Actions,
    private candlestickService: CandlestickService,
    private emaService: EmaService,
    private macdService: MacdService
  ) {}

  getCandlestickAndEma$ = createEffect( () : Observable<Action> =>
    this.actions$.pipe(
      ofType(getCandlestickAndEma),
      switchMap( (action:{tickerCode: string; stockExchangeCode: string; begin: string; end: string; duration: number}) => {
        return this.getCandlestickAndEmaAux$(action.tickerCode, action.stockExchangeCode, action.begin, action.end, action.duration)
          .pipe(
            map((chartState) => {
              if(chartState instanceof Error){
                throwError(() => chartState);
              }
              return getCandlestickAndEmaSuccess(chartState as ChartState)
            }),
            catchError(
              error => of(getCandlestickAndEmaFail({error: error}))
            )
          );
      }),
      catchError(
        error => of(getCandlestickAndEmaFail({error: error}))
      )
    )
  );

  getCandlestickAndEmaAux$(tickerCode: string, stockExchangeCode: string, begin: string, end: string, duration: number):Observable<ChartState|Error>{
    return this.candlestickService.getCandlestickByTickerCodeAndDateRange(tickerCode, stockExchangeCode, begin, end, duration)
      .pipe(
        filter( (candlestick: CandlestickModel) => !!candlestick),
        map((candlestick: CandlestickModel) => {
          let data = candlestick.candles.map( (candle: CandleModel) => [candle.low, candle.open, candle.close, candle.high]);
          let timestamps = candlestick.candles.map((candle: CandleModel) => {
            const regexArray = candle.end.match(/\d\d:\d\d:\d\d/);
            return regexArray?regexArray[0]:'0';
          });
          let dataModel = new ChartDataModel(data,timestamps);
          return {
            title: stockExchangeCode+':'+tickerCode,
            dataModel: dataModel
          };
        }),
      ).pipe(
        map( ({ title, dataModel}) => {
            return {
              title: title,
              chartDataModel: dataModel,
              response: this.emaService.getExponentialMovingAverageByTickerCodeAndDateRange(tickerCode, stockExchangeCode, begin, end, duration)
            }
          }
        )
      ).pipe(
        map(({title, chartDataModel, response}) => {
          return response.pipe( map((movingAverageResponseModel) => {
              if (movingAverageResponseModel instanceof Error) {
                return movingAverageResponseModel;
              }
              else{
                chartDataModel.timestamps.forEach((ts, i) => {
                  const movingAverage = movingAverageResponseModel.movingAverages.filter((ma: any) => ma.timestamp.match(ts));
                  if (!!movingAverage && movingAverage.length > 0) {
                    chartDataModel.data[i].push(movingAverage[0].value);
                  }
                })
                return {title: title, dataModel: chartDataModel}
              }
            })
          )
        }),
        switchAll()
      )
  }

  // TODO subscribe to this effect on the new chart that will go in the array of charts in the plotter component
  getMacdAndSignal$ = createEffect( (): Observable<Action> =>
    this.actions$.pipe(
      ofType(getMacdAndSignal),
      mergeMap((action) => {
        return this.macdService.getMacdByTickerCodeAndDateRange(
          action.tickerCode, action.stockExchangeCode,action.begin,
          action.end, action.duration1, action.duration2, action.signalDuration)
          .pipe(
            map((response) => {
              if(response instanceof Error){
                throwError(() => response);
              }
              return getMacdAndSignalSuccess(response as MacdResponseModel);
            })
          )
      }),
      catchError(
        error => of(getMacdAndSignalFail({error: error}))
      )
    )
  );

}
