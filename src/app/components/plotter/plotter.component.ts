import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartModel} from "../../model/chart.model";
import {ChartType} from "angular-google-charts";
import {Store} from "@ngrx/store";
import {ChartState} from "../../store/chart/chart.state";
import {selectCandlestickWithEma} from "../../store/chart/chart.selector";
import {ChartDirective} from "./chart/chart.directive";
import {ChartComponent} from "./chart/chart.component";

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements OnInit{

  @ViewChild(ChartDirective, {static: true}) chart!: ChartDirective;

  constructor(
    private store: Store<ChartState>
  ) {
  }

  ngOnInit(): void {
    const viewContainerRef = this.chart.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<ChartComponent>(ChartComponent);
    componentRef.instance.chartModel = this.getComboCandlestickAndEma();
  }

  getComboCandlestickAndEma(){
    return new ChartModel(
      'blaster',
      ChartType.ComboChart,
      null,
      {
        seriesType: 'candlesticks',
        series: {1 : {type: 'line'}},
        legend:'none',
        candlestick: {
          fallingColor: { strokeWidth: 2, stroke:'#a52714' }, // red
          risingColor: { strokeWidth: 2, stroke: '#0f9d58' }, // green
        },
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      selectCandlestickWithEma,
      this.store);
  }

}
