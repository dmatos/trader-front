import {Component, Input} from '@angular/core';
import {ChartModel} from "../../../model/chart.model";
import {
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  getVolumeHistogram
} from "../../../store/chart/chart.actions";
import {ChartType} from "angular-google-charts";
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

@Component({
  selector: 'app-candlestick',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.css']
})
export class CandlestickComponent{

  candlestickChartModel: ChartModel = this.getComboCandlestickAndEma();
  volumeChartModel: ChartModel = this.getVolumeHistogram();
  candlestickData: (string|number)[][]|undefined = undefined;
  volumeData: (string|number)[][]|undefined = undefined;
  public settingsComponent = SettingsComponent;
  private settings$: Observable<any>;
  public _KEY = "chartTimeframe";
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};
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
  }

  setSubscriptions(){
    setTimeout( () => {
      this.candlestickChartModel.getObservable$().subscribe((data) => {
        const chartKey = this.candlestickChartModel?.chartKey;
        if (chartKey && this.candlestickChartModel && data.get(chartKey)) {
          this.candlestickChartModel.dataModel = data.get(chartKey)?.dataModel;
          this.candlestickData = this.candlestickChartModel.getDataAsArrayOfArrays();
        }
      });
      this.volumeChartModel.getObservable$().subscribe((data) => {
          const chartKey = this.volumeChartModel?.chartKey;
          if (chartKey && this.volumeChartModel && data.get(chartKey)) {
            this.volumeChartModel.dataModel = data.get(chartKey)?.dataModel;
            this.volumeData = this.volumeChartModel.getDataAsArrayOfArrays();
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
      ChartType.ComboChart,
      null,
      {
        seriesType: 'candlesticks',
        series: {1 : {type: 'line', color: 'blue'}},
        legend:'none',
        candlestick: {
          fallingColor: { strokeWidth: 1, stroke:'black', fill:'#000000' },
          risingColor: { strokeWidth: 1, stroke: 'black', fill:'#FFFFFF' },
        },
        colors:['#000'],
        hAxis: {textPosition: 'none'}
      },
      this.settingsModel,
      this.store);
  }

  getVolumeHistogram(){
    return new ChartModel(
      'VolumeHistogram',
      GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
      ChartType.ComboChart,
      null,
      {
        seriesType: 'bars',
        legend: 'none',
        colors:['#000'],
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
}
