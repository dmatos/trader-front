import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartModel} from "../../model/chart.model";
import {ChartType} from "angular-google-charts";
import {Store} from "@ngrx/store";
import {ChartState} from "../../store/chart/chart.state";
import {selectCandlestickWithEma} from "../../store/chart/chart.selector";
import {ChartDirective} from "./chart/chart.directive";
import {ChartComponent} from "./chart/chart.component";
import {ActivatedRoute, Params} from "@angular/router";
import {selectTicker} from "../../store/tickers/tickers-list.actions";
import {TickersState} from "../../store/tickers/tickers-list.state";

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements OnInit{
  @ViewChild(ChartDirective, {static: true}) chart!: ChartDirective;
  private tickerCode: string = '';
  private stockExchangeCode: string = '';
  private begin: string = '';
  private end: string = '';
  private duration: number = 5;

  constructor(
    private route: ActivatedRoute,
    private store: Store<ChartState>
  ) {
  }

  ngOnInit(): void {
    const viewContainerRef = this.chart.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<ChartComponent>(ChartComponent);
    componentRef.instance.chartModel = this.getComboCandlestickAndEma();
    this.readParams(this.route.snapshot.params);
    this.readQueryParams(this.route.snapshot.queryParams);
    this.route.params.subscribe((params) =>{
      this.readParams(params);
      this.dispatchSelectTickerAction();
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
      this.dispatchSelectTickerAction();
    });
    this.dispatchSelectTickerAction();
  }

  readParams(params: Params){
    this.tickerCode = params['tickerCode'];
    this.stockExchangeCode = params['stockExchangeCode'];
  }

  readQueryParams(params: Params){
    this.begin = params['begin'];
    this.end = params['end'];
    this.duration = params['duration'];
  }

  dispatchSelectTickerAction(){
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      duration: this.duration}));
  }

  getComboCandlestickAndEma(){
    return new ChartModel(
      'ComboCandlestickAndEma',
      ChartType.ComboChart,
      null,
      {
        seriesType: 'candlesticks',
        series: {1 : {type: 'line'}},
        legend:'none',
        candlestick: {
          fallingColor: { strokeWidth: 1, stroke:'#000' },
          risingColor: { strokeWidth: 1, stroke: '#fff' },
        },
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      selectCandlestickWithEma,
      this.store);
  }

}
