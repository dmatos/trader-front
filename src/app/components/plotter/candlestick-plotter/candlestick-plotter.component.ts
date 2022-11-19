import { Component, OnInit } from '@angular/core';
import {
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartSelectionChangedEvent,
  ChartType,
  GoogleChartComponent,
  GoogleChartsModule
} from "angular-google-charts";
import {CandlestickState} from "../../../store/candlestick/candlestick.state";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {Ticker} from "../../../model/ticker.model";
import {CandlestickModel} from "../../../model/candlestick.model";
import {selectCandlestickState} from "../../../store/candlestick/candlestick.selector";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-candlestick-plotter',
  templateUrl: './candlestick-plotter.component.html',
  styleUrls: ['./candlestick-plotter.component.css']
})
export class CandlestickPlotterComponent implements OnInit {

  candlestick$: Observable<CandlestickState>;

  title = 'chart example';
  type = ChartType.CandlestickChart
  data = [
    ['09:05', 20, 28, 38, 45]
  ];
  options = {
    legend:'none',
    candlestick: {
      fallingColor: { strokeWidth: 2, stroke:'#a52714' }, // red
      risingColor: { strokeWidth: 2, stroke: '#0f9d58' }   // green
    }
  };
  width = 3000;
  height = 600;


  constructor(
    private store: Store<CandlestickState>
  ) {
    this.candlestick$ = this.store.pipe(select(selectCandlestickState));
  }

  ngOnInit(): void {
    this.candlestick$.subscribe( (candlestickState) => {
        if(candlestickState.candlestick.candles.length > 0) {
          this.title = candlestickState.candlestick.stockExchangeCode+':'+candlestickState.candlestick.tickerCode;
          this.data = candlestickState.candlestick.candles.map(candle => [candle.begin, candle.low, candle.open, candle.close, candle.high])
          console.log('data on subscription');
          console.log(this.data);
        }
      }
    );
  }

  onSelect(event: ChartSelectionChangedEvent){
  }

  onMouseOver(event: ChartMouseOverEvent){
  }

  onMouseLeave(event: ChartMouseLeaveEvent){
  }

}
