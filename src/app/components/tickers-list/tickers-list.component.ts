import {Component, OnInit} from '@angular/core';
import {Ticker} from "../../model/ticker.model";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {getAllTickers, searchTickersByCode, selectTicker} from "../../store/tickers/tickers-list.actions";
import {selectTickers} from "../../store/tickers/tickers-list.selector";
import {TickersState} from "../../store/tickers/tickers-list.state";

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css']
})
export class TickersListComponent implements OnInit {
  tickers$: Observable<Ticker[]>;

  constructor(
    private store: Store<TickersState>) {
    this.tickers$ = this.store.pipe(select(selectTickers));
  }

  ngOnInit(): void {
    this.getAllTickers();
  }

  getAllTickers(){
    this.store.dispatch(getAllTickers());
  }

  onSelectTicker(ticker: Ticker){
    console.log(ticker);
    this.store.dispatch(selectTicker({
      tickerCode: ticker.code,
      stockExchangeCode: ticker.stockExchangeCode,
      begin: '2022-11-17T00:58:42.783Z',
      end: '2022-11-17T23:58:42.783Z',
      duration: 5}));
  }

  onSearchTicker(event: any){
    if(event && event.target && event.target.value){
      const code = event.target.value;
      this.store.dispatch(searchTickersByCode({code}));
    } else {
      this.getAllTickers();
    }
  }
}
