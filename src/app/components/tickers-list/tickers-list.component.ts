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
  public tickerCode: string;
  public selectedTicker: Ticker|null = null;
  public duration: number = 5;

  constructor(
    private store: Store<TickersState>) {
    this.tickers$ = this.store.pipe(select(selectTickers));
    this.tickers = this.filteredTickers = [];
    this.date = new Date().toISOString();
    this.tickerCode = "";
  }

  ngOnInit(): void {
    this.getAllTickers();
    this.tickers$.subscribe((tickers) => this.tickers = this.filteredTickers = tickers);
  }

  getAllTickers(){
    this.store.dispatch(getAllTickers());
  }

  onInputChange(){
    this.onSelectTicker(this.selectedTicker);
  }

  convertDateToUTC(date: Date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  onSelectTicker(ticker: Ticker|null){
    if(!ticker) return;
    let begin = this.convertDateToUTC(new Date(this.date));
    let end = this.convertDateToUTC(new Date(this.date));
    let beginStr = begin.toISOString();
    let endStr = end.toISOString();
    beginStr = beginStr.replace(/(T..:..)/, 'T00:00');
    endStr = endStr.replace(/(T..:..)/, 'T23:59');
    this.tickerCode = ticker.code;
    this.selectedTicker = ticker;
    this.store.dispatch(selectTicker({
      tickerCode: ticker.code,
      stockExchangeCode: ticker.stockExchangeCode,
      begin: beginStr,
      end: endStr,
      duration: this.duration}));
  }

  onSearchTicker(){
    if(this.tickerCode){
      const code = this.tickerCode.toUpperCase();
      this.filteredTickers = this.tickers.filter(t => t.code.match('.*'+code+'.*') || t.stockExchangeCode.match('.*'+code+'.*'));
    } else {
      this.getAllTickers();
    }
  }
}
