import {Component, OnInit} from '@angular/core';
import {Ticker} from "../../model/ticker.model";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {getAllTickers, selectTicker} from "../../store/tickers/tickers-list.actions";
import {selectTickers} from "../../store/tickers/tickers-list.selector";
import {TickersState} from "../../store/tickers/tickers-list.state";

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css']
})
export class TickersListComponent implements OnInit {
  tickers$: Observable<Ticker[]>;
  public tickers: Ticker[];
  public filteredTickers: Ticker[];
  public date: string;

  constructor(
    private store: Store<TickersState>) {
    this.tickers$ = this.store.pipe(select(selectTickers));
    this.tickers = this.filteredTickers = [];
    this.date = new Date().toISOString();
  }

  ngOnInit(): void {
    this.getAllTickers();
    this.tickers$.subscribe((tickers) => this.tickers = this.filteredTickers = tickers);
  }

  getAllTickers(){
    this.store.dispatch(getAllTickers());
  }

  onSelectTicker(ticker: Ticker){
    let begin = new Date(this.date);
    begin.setHours(0);
    begin.setMinutes(0);
    let end = new Date(this.date);
    end.setHours(23);
    end.setMinutes(59);
    this.store.dispatch(selectTicker({
      tickerCode: ticker.code,
      stockExchangeCode: ticker.stockExchangeCode,
      begin: begin.toISOString(),
      end: end.toISOString(),
      duration: 5}));
  }

  onSearchTicker(event: any){
    if(event && event.target && event.target.value){
      const code = event.target.value.toUpperCase();
      this.filteredTickers = this.tickers.filter(t => t.code.match('.*'+code+'.*'));
    } else {
      this.getAllTickers();
    }
  }
}
