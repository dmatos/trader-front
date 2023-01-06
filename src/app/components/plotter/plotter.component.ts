import {AfterViewInit, Component, OnInit, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {ChartModel} from "../../model/chart.model";
import {ChartType} from "angular-google-charts";
import {Store} from "@ngrx/store";
import {ChartState} from "../../store/chart/chart.state";
import {ChartDirective} from "./chart/chart.directive";
import {ChartComponent} from "./chart/chart.component";
import {ActivatedRoute, Params} from "@angular/router";
import {selectTicker} from "../../store/tickers/tickers-list.actions";
import {
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TIPE,
  getMacdAndSignal
} from "../../store/chart/chart.actions";
import {Title} from "@angular/platform-browser";
import {SettingsComponent} from "./chart/settings/settings.component";
import {SettingsModel} from "../../model/settings.model";

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements OnInit, AfterViewInit{
  @ViewChildren('customChart', {read: ViewContainerRef})
  charts!: QueryList<ChartDirective>;
  public chartModels:ChartModel[] = [
    this.getComboCandlestickAndEma(),
    this.getMacdAndSignal()
  ];
  public tickerCode: string = '';
  public stockExchangeCode: string = '';
  private begin: string = '';
  private end: string = '';
  private duration: number = 5;

  constructor(
    private route: ActivatedRoute,
    private store: Store<Map<string, ChartState>>,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.readParams(this.route.snapshot.params);
    this.readQueryParams(this.route.snapshot.queryParams);
    this.route.params.subscribe((params) =>{
      this.readParams(params);
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
    });
    //TODO esses valores podem deixar de ser hardcoded? podem vir dos params, não podem?
    this.dispatchSelectTickerAction([{name: "", value: this.duration, text:"", type:""}]);
    this.dispatchMacdAndSignalAction([
      {name: "", value: 3, text:"", type:""},
      {name: "", value: 15, text:"", type:""},
      {name: "", value: 30, text:"", type:""}
    ]);
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
          switch (componentRef.instance.chartModel?.chartKey){
            case  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TIPE:{
              this.dispatchMacdAndSignalAction(settings);
              break;
            }
            case GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE:
              this.dispatchSelectTickerAction(settings);
              break;
          }
          this.setCharts();
        })
      })
    }, 100);
    //TODO tem que ter um jeito de fazer isso sem o timeout, esperando algum observer or some shit like that
  }

  ngAfterViewInit(){
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
    this.duration = params['duration'];
    this.setCharts();
  }

  dispatchMacdAndSignalAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(getMacdAndSignal({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      duration1: settings[0].value,
      duration2: settings[1].value,
      signalDuration: settings[2].value
    }));
  }

  dispatchSelectTickerAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      duration: settings[0].value
    }));
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
          fallingColor: { strokeWidth: 1, stroke:'#000', fill:'#000' },
          risingColor: { strokeWidth: 1, stroke: '#000', fill:'#fff' }
        },
        colors:['#000'],
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      [{name: "duration", value: this.duration, text:"EMA #1", type:"number"}],
      this.store);
  }

  getMacdAndSignal(){
    return new ChartModel(
      'ComboMacdAndLine',
      GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TIPE,
      ChartType.ComboChart,
      null,
      {
        seriesType: 'line',
        series: {1 : {type: 'line', color: 'blue'}},
        legend:'none',
        colors:['#000'],
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      [
        {name: "duration1", value: 3, text:"Fast EMA", type:"number"},
        {name: "duration2", value: 15, text:"Slow EMA", type:"number"},
        {name: "signalDuration", value: 30, text:"Signal", type:"number"}
      ],
      this.store);
  }
}
