import {Component, HostListener, OnInit} from '@angular/core';
import {ChartMouseLeaveEvent, ChartMouseOverEvent, ChartSelectionChangedEvent, ChartType} from "angular-google-charts";
import {CandlestickState} from "../../../store/candlestick/candlestick.state";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectCandlestickState} from "../../../store/candlestick/candlestick.selector";

@Component({
  selector: 'app-candlestick-plotter',
  templateUrl: './candlestick-plotter.component.html',
  styleUrls: ['./candlestick-plotter.component.css']
})
export class CandlestickPlotterComponent implements OnInit {

  candlestick$: Observable<CandlestickState>;

  title = 'Canldestick';
  type = ChartType.CandlestickChart
  data = [
    ['09:05', 20, 28, 38, 45]
  ];
  options: google.visualization.CandlestickChartOptions = {
    legend:'none',
    candlestick: {
      fallingColor: { strokeWidth: 2, stroke:'#a52714' }, // red
      risingColor: { strokeWidth: 2, stroke: '#0f9d58' }, // green
    },
    hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 16}}
  };
  width = 0;
  height = 0;


  constructor(
    private store: Store<CandlestickState>
  ) {
    this.candlestick$ = this.store.pipe(select(selectCandlestickState));
  }

  ngOnInit(): void {
    this.candlestick$.subscribe( (candlestickState) => {
        if(candlestickState && candlestickState.candlestick && candlestickState.candlestick.candles && candlestickState.candlestick.candles.length > 0) {
          this.title = candlestickState.candlestick.stockExchangeCode+':'+candlestickState.candlestick.tickerCode;
          this.data = candlestickState.candlestick.candles.map(candle => {
            const regexArray = candle.end.match(/\d\d:\d\d:\d\d/);
            const date = regexArray?regexArray[0]:'0';
            return [date, candle.low, candle.open, candle.close, candle.high]
          })
        } else {
          this.data = [];
        }
      }
    );
    this.resize();
  }

  onResize(){
   this.resize();
  }

  resize(){
    this.width = window.innerWidth*(5/6);
    this.height =window.innerHeight*0.4;
  }
}
