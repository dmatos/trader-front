import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CandlestickService} from "../../service/candlestick.service";
import {filter, Observable, of, switchAll, switchMap, throwError} from "rxjs";
import {
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  getCandlestickAndEma,
  getCandlestickAndEmaFail,
  getCandlestickAndEmaSuccess,
  getMacdAndSignal,
  getMacdAndSignalFail,
  getMacdAndSignalSuccess
} from "./chart.actions";
import {catchError, map} from "rxjs/operators";
import {EmaService} from "../../service/ema.service";
import {CandlestickModel} from "../../model/candlestick.model";
import {ChartDataModel} from "../../model/chart-data.model";
import {CandleModel} from "../../model/candle.model";
import {ChartState} from "./chart.state";
import {MacdService} from "../../service/macd.service";

@Injectable()
export class ChartEffects{
  constructor(
    private actions$: Actions,
    private candlestickService: CandlestickService,
    private emaService: EmaService,
    private macdService: MacdService
  ) {}

  getCandlestickAndEma$ = createEffect( () : Observable<any> =>
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

  getCandlestickAndEmaAux$(tickerCode: string, stockExchangeCode: string, begin: string, end: string, duration: number):Observable<any>{
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
        catchError(error => throwError(() => error))
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
                  } else {
                    const value = chartDataModel.data[i][3];
                    chartDataModel.data[i].push(value);
                  }
                })
                return {title: title, dataModel: chartDataModel, type: GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE}
              }
            })
          )
        }),
        switchAll()
      )
  }

  getMacdAndSignal$ = createEffect( (): Observable<any> =>
    this.actions$.pipe(
      ofType(getMacdAndSignal),
      switchMap((action) => {
        return this.macdService.getMacdByTickerCodeAndDateRange(
          action.tickerCode, action.stockExchangeCode,action.begin,
          action.end, action.duration1, action.duration2, action.signalDuration)
          .pipe(
            map((response) => {
              if(response instanceof Error){
                return getMacdAndSignalFail({error: response});
              }
              const data: number[][] = [];
              const timestamps: string[] = [];
              response.macd.forEach((ma,index) => {
                const regexArray = ma.timestamp.match(/\d\d:\d\d:\d\d/);
                let timestamp =  regexArray?regexArray[0]:'0';
                timestamps.push(timestamp);
                data.push([ma.value, response.signal[index].value]);
              });
              const dataModel = new ChartDataModel(data,timestamps);
              return getMacdAndSignalSuccess({title:action.stockExchangeCode+':'+action.tickerCode, dataModel: dataModel});
            })
          )
      }),
      catchError(
        error => {
          return of(getMacdAndSignalFail({error: error}));
        }
      )
    )
  );

}
