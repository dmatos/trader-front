import {AfterViewInit, Component, OnInit, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {ChartModel} from "../../model/chart.model";
import {ChartType} from "angular-google-charts";
import {select, Store} from "@ngrx/store";
import {ChartState} from "../../store/chart/chart.state";
import {ChartDirective} from "./chart/chart.directive";
import {ChartComponent} from "./chart/chart.component";
import {ActivatedRoute, Params} from "@angular/router";
import {selectTicker} from "../../store/tickers/tickers-list.actions";
import {
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  getMacdAndSignal, getVolumeHistogram
} from "../../store/chart/chart.actions";
import {Title} from "@angular/platform-browser";
import {SettingsComponent} from "./chart/settings/settings.component";
import {SettingsModel} from "../../model/settings.model";
import {Observable} from "rxjs";
import {SettingsState} from "../../store/settings/settings.state";
import {selectSettings} from "../../store/settings/settings.selector";
import {setSettings} from "../../store/settings/settings.actions";

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements OnInit, AfterViewInit{
  @ViewChildren('customChart', {read: ViewContainerRef})
  charts!: QueryList<ChartDirective>;
  public chartModels:ChartModel[];
  public tickerCode: string = '';
  public stockExchangeCode: string = '';
  private begin: string = '';
  private end: string = '';
  private settings$: Observable<any>;
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};

  constructor(
    private route: ActivatedRoute,
    private store: Store<Map<string, ChartState>>,
    private settingsStore: Store<SettingsState>,
    private titleService: Title
  ) {
    this.settings$ = this.settingsStore.pipe(select(selectSettings));
    this.chartModels = this.initializeChartModels();
  }

  ngOnInit(): void {
    this.settings$.subscribe( (state) => {
      if(!!state["settings"]){
        this.settings = state;
      }
    });
    this.readParams(this.route.snapshot.params);
    this.readQueryParams(this.route.snapshot.queryParams);
    this.route.params.subscribe((params) =>{
      this.readParams(params);
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
    });
    this.setCharts();
  }

  initializeChartModels(){
    this.chartModels = [
      this.getComboCandlestickAndEma(),
      this.getMacdAndSignal(),
      this.getVolumeHistogram()
    ];
    return this.chartModels;
  }

  setCharts(){
    setTimeout(()=>{
      this.charts.forEach( (chart, index) => {
        const viewContainerRef = (chart as unknown) as ViewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent<ChartComponent>(ChartComponent);
        componentRef.instance.chartModel =  this.chartModels[index];
        componentRef.instance.settingsComponent = SettingsComponent;
        componentRef.instance.callBack$.subscribe((settings: SettingsModel[]) => {
          const settingsState = {settings: new Map<string, SettingsModel>()};
          settings?.forEach( (setting) => {
            settingsState.settings.set(setting.name, setting);
          });
          this.settingsStore.dispatch(setSettings(settingsState));
          switch (componentRef.instance.chartModel?.chartKey){
            case  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE:{
              this.dispatchMacdAndSignalAction(settings);
              break;
            }
            case GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE:
            case GET_VOLUME_HISTOGRAM_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE: {
              this.dispatchSelectTickerAction(settings);
              this.dispatchStockQuotesVolumeHistogramAction(settings);
              break;
            }
          }
          this.setCharts();
        })
      })
    }, 200);
    //TODO tem que ter um jeito de fazer isso sem o timeout, esperando algum observer or some shit like that
  }

  ngAfterViewInit(){
    this.initializeChartModels();
    this.setCharts();
  }

  readParams(params: Params){
    this.tickerCode = params['tickerCode'];
    this.stockExchangeCode = params['stockExchangeCode'];
    this.titleService.setTitle(this.tickerCode+':'+this.stockExchangeCode);
    this.setCharts();
  }

  readQueryParams(params: Params){
    this.begin = params['begin'];
    this.end = params['end'];
    this.setCharts();
  }

  dispatchMacdAndSignalAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(getMacdAndSignal({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe1: this.settings?.settings.get("macdTimeframe1")?.value,
      timeframe2: this.settings?.settings.get("macdTimeframe2")?.value,
      signalTimeframe: this.settings?.settings.get("macdSignalTimeframe")?.value,
    }));
  }

  dispatchSelectTickerAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe: this.settings?.settings.get("chartTimeframe")?.value
    }));
  }

  dispatchStockQuotesVolumeHistogramAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(getVolumeHistogram({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe: this.settings?.settings.get("chartTimeframe")?.value
    }));
  }

  getCustomSettings(keys: string[]){
    let customSettings: SettingsModel[] = [];
    keys.forEach( key => {
      let setting = this.settings.settings.get(key);
      if(!!setting) customSettings.push(setting);
    })
    return customSettings;
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
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      this.getCustomSettings(["chartTimeframe"]),
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
      this.getCustomSettings(["chartTimeframe"]),
      this.store);
  }

  getMacdAndSignal(){
    return new ChartModel(
      'ComboMacdAndLine',
      GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
      ChartType.ComboChart,
      null,
      {
        seriesType: 'line',
        series: {1 : {type: 'line', color: 'blue'}},
        legend:'none',
        colors:['#000'],
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      this.getCustomSettings(["macdTimeframe1", "macdTimeframe2", "macdSignalTimeframe"]),
      this.store);
  }
}
