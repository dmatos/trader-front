import {AfterViewInit, Component, OnInit, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {ChartModel} from "../../model/chart.model";
import {ChartType} from "angular-google-charts";
import {select, Store} from "@ngrx/store";
import {ChartState} from "../../store/chart/chart.state";
import {selectChart} from "../../store/chart/chart.selector";
import {ChartDirective} from "./chart/chart.directive";
import {ChartComponent} from "./chart/chart.component";
import {ActivatedRoute, Params} from "@angular/router";
import {selectTicker} from "../../store/tickers/tickers-list.actions";
import {
  GET_COMBO_CANDLESTICK_AND_EMA_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TIPE,
  getMacdAndSignal
} from "../../store/chart/chart.actions";

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
  private tickerCode: string = '';
  private stockExchangeCode: string = '';
  private begin: string = '';
  private end: string = '';
  private duration: number = 5;

  constructor(
    private route: ActivatedRoute,
    private store: Store<Map<string, ChartState>>
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
    this.dispatchSelectTickerAction();
  }

  setCharts(){
    setTimeout(()=>{
      this.charts.forEach((chart, index) => {
        const viewContainerRef = (chart as unknown) as ViewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent<ChartComponent>(ChartComponent);
        componentRef.instance.chartModel =  this.chartModels[index];
      });
    }, 50);
  }

  ngAfterViewInit(){
    this.setCharts();
  }

  readParams(params: Params){
    this.tickerCode = params['tickerCode'];
    this.stockExchangeCode = params['stockExchangeCode'];
    this.setCharts();
  }

  readQueryParams(params: Params){
    this.begin = params['begin'];
    this.end = params['end'];
    this.duration = params['duration'];
    this.setCharts();
  }

  dispatchSelectTickerAction(){
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      duration: this.duration}));
    this.store.dispatch(getMacdAndSignal({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      duration1: 2,
      duration2: 7,
      signalDuration: 21,
    }))
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
      this.store);
  }
}
