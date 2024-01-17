import {Component, Input} from '@angular/core';
import {ChartModel} from "../../../model/chart.model";
import {
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  getVolumeHistogram
} from "../../../store/chart/chart.actions";
import {SettingsModel} from "../../../model/settings.model";
import {select, Store} from "@ngrx/store";
import {ChartState} from "../../../store/chart/chart.state";
import {SettingsComponent} from "../settings/settings.component";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {selectSettings} from "../../../store/settings/settings.selector";
import {SettingsState} from "../../../store/settings/settings.state";
import {selectTicker} from "../../../store/tickers/tickers-list.actions";
import {ActivatedRoute, Params} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {DownloadCsvComponent} from "../download-csv/download-csv.component";
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-candlestick',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.css']
})
export class CandlestickComponent{

  candlestickChartModel: ChartModel = this.getComboCandlestickAndEma();
  volumeChartModel: ChartModel = this.getVolumeHistogram();
  public settingsComponent = SettingsComponent;
  private settings$: Observable<any>;
  public _KEY = "chartTimeframe";
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};
  private candlestickApexChartRenderer: ApexCharts | undefined;
  private volumeApexChartRenderer: ApexCharts | undefined;
  @Input() tickerCode: string = '';
  @Input() stockExchangeCode: string = '';
  @Input() begin: string = '';
  @Input() end: string = '';
  @Input() settingsModel: SettingsModel[] = [];
  searchString = '';

  constructor(
    private store: Store<Map<string, ChartState>>,
    private settingsStore: Store<SettingsState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    this.settings$ = this.settingsStore.pipe(select(selectSettings));
  }

  ngOnInit(): void {
    this.settings$.subscribe( (state) => {
      if(!!state["settings"]){
        this.settings = state;
      }
    });
    this.setSubscriptions();
    this.route.params.subscribe((params) =>{
      this.readParams(params);
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
    });
    this.dispatchSelectTickerAction(this.settingsModel);
    this.dispatchStockQuotesVolumeHistogramAction(this.settingsModel);
  }

  setSubscriptions(){
    setTimeout( () => {
      this.candlestickChartModel.getObservable$().subscribe((data) => {
        const chartKey = this.candlestickChartModel?.chartKey;
        if (chartKey && this.candlestickChartModel && data.get(chartKey)) {
          this.candlestickChartModel.dataModel = data.get(chartKey)?.dataModel;
          if (this.candlestickChartModel) {
            let candleData: { x: string, y: number[] | undefined }[] = [];
            let ema: { x: string, y: number | undefined }[] = [];
            let pivot: { x: string, y: number | undefined }[] = [];
            let r1: { x: string, y: number | undefined }[] = [];
            let r2: { x: string, y: number | undefined }[] = [];
            let r3: { x: string, y: number | undefined }[] = [];
            let s1: { x: string, y: number | undefined }[] = [];
            let s2: { x: string, y: number | undefined }[] = [];
            let s3: { x: string, y: number | undefined }[] = [];

            this.candlestickChartModel.dataModel?.timestamps.forEach((ts, index) => {
              let candle = this.candlestickChartModel.dataModel?.data[index];
              candleData?.push({x: ts, y: candle});
              ema.push({x: ts, y: candle ? candle[4] : 0});
              pivot.push({x: ts, y: candle ? candle[5] : 0});
              r1.push({x: ts, y: candle ? candle[6] : 0});
              r2.push({x: ts, y: candle ? candle[7] : 0});
              r3.push({x: ts, y: candle ? candle[8] : 0});
              s1.push({x: ts, y: candle ? candle[9] : 0});
              s2.push({x: ts, y: candle ? candle[10] : 0});
              s3.push({x: ts, y: candle ? candle[11] : 0});
            });

            let options = {
              chart: {
                id: 'candlestick-1',
                height: 250
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: 1,
              },
              xaxis: {
                categories:  this.candlestickChartModel.dataModel?.timestamps,
                labels: {
                  show: false
                }
              },
              colors: ["rgba(0,183,70,0.85)", '#0a20ff', '#ff0a0a'],
              series: [
                {
                  name: 'candlestick',
                  data: candleData ? candleData : [],
                  type: this.candlestickChartModel.chartType
                }, {
                  name: 'ema',
                  data: ema ? ema : [],
                  type: 'line'
                }, {
                  name: 'pivot',
                  data: pivot ? pivot : [],
                  type: 'line'
                }, {
                  name: 'r1',
                  data: r1 ? r1 : [],
                  type: 'line'
                }, {
                  name: 'r2',
                  data: r2 ? r2 : [],
                  type: 'line'
                }, {
                  name: 'r3',
                  data: r3 ? r3 : [],
                  type: 'line'
                }, {
                  name: 's1',
                  data: s1 ? s1 : [],
                  type: 'line'
                }, {
                  name: 's2',
                  data: s2 ? s2 : [],
                  type: 'line'
                }, {
                  name: 's3',
                  data: s3 ? s3 : [],
                  type: 'line'
                }
              ]
            }
            if(this.candlestickApexChartRenderer){
              this.candlestickApexChartRenderer.destroy();
            }
            this.candlestickApexChartRenderer = new ApexCharts(document.querySelector("#candlestick"), options);
            this.candlestickApexChartRenderer.render();
          }
        }
      });
      this.volumeChartModel.getObservable$().subscribe((data) => {
          const chartKey = this.volumeChartModel?.chartKey;
          if (chartKey && this.volumeChartModel && data.get(chartKey)) {
            this.volumeChartModel.dataModel = data.get(chartKey)?.dataModel;
            let volume:(number|string)[] = [];
            this.volumeChartModel.dataModel?.data.forEach(
              (datapointArray) => {
                volume.push(datapointArray[0])
              }
            );
            let options = {
              chart: {
                type: this.volumeChartModel.chartType,
                height: 100,
                id: 'volume-1',
              },
              dataLabels: {
                enabled: false
              },
              xaxis: {
                categories:  this.volumeChartModel.dataModel?.timestamps,
                labels: {
                  show: false
                }
              },
              series: [
                {
                  name: 'volume',
                  data:  volume
                }
              ]
            }
            if(this.volumeApexChartRenderer){
              this.volumeApexChartRenderer.destroy();
            }
            this.volumeApexChartRenderer = new ApexCharts(document.querySelector("#volume"), options);
            this.volumeApexChartRenderer.render();
          }
        }
      )
    }, 200);

  }

  readParams(params: Params){
    this.tickerCode = params['tickerCode'];
    this.stockExchangeCode = params['stockExchangeCode'];
    this.titleService.setTitle(this.tickerCode+':'+this.stockExchangeCode);
    this.setSubscriptions();
  }

  readQueryParams(params: Params){
    this.begin = params['begin'];
    this.end = params['end'];
    this.searchString = params['search']
    this.setSubscriptions();
  }

  getComboCandlestickAndEma(){
    return new ChartModel(
      'ComboCandlestickAndEma',
      GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
      'candlestick',
      null,
      {
        seriesType: 'candlesticks',
        series: {1 : {type: 'line', color: '#2196f3'}},
        legend:'none',
        candlestick: {
          fallingColor: { strokeWidth: 1, stroke:'black', fill:'#000000' },
          risingColor: { strokeWidth: 1, stroke: 'black', fill:'#FFFFFF' },
        },
        colors:['#2196f3'],
        hAxis: {textPosition: 'none'}
      },
      this.settingsModel,
      this.store);
  }

  getVolumeHistogram(){
    return new ChartModel(
      'VolumeHistogram',
      GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
      'bar',
      null,
      {
        seriesType: 'bars',
        legend: 'none',
        colors:['#2196f3'],
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      this.settingsModel,
      this.store);
  }

  dispatchSelectTickerAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe: this.settings?.settings.get(this._KEY)?.value
    }));
  }

  dispatchStockQuotesVolumeHistogramAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(getVolumeHistogram({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe: this.settings?.settings.get(this._KEY)?.value
    }));
  }

  onSettings() {
    if (!!this.settingsComponent) {
      const dialogRef = this.dialog.open(this.settingsComponent, {
        width: '350px',
        data: {
          settings: [this.settings.settings.get(this._KEY)]
        },
      });
      dialogRef.afterClosed().subscribe((settings: SettingsModel[]) => {
        this.dispatchSelectTickerAction(settings);
        this.dispatchStockQuotesVolumeHistogramAction(settings);
        this.setSubscriptions();
      });
    }
  }

  onDownload(){
    const dialogRef = this.dialog.open(DownloadCsvComponent, {
      width: '350px',
      data: {
        settings: [this.settings.settings.get(this._KEY)]
      },
    });
    dialogRef.afterClosed().subscribe((settings: SettingsModel[]) => {
      //TODO call actual download
    });
  }
}
