import {Component, EventEmitter, OnInit} from '@angular/core';
import {Ticker} from "../model/ticker.model";
import {TickersService} from "../service/tickers.service";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {getAllTickers, searchTickersByCode} from "../store/tickers-list.actions";
import {TickersState} from "../store/tickers-list.reducer";
import {selectTickers} from "../store/tickers-list.selector";

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css']
})
export class TickersListComponent implements OnInit {
  tickers$: Observable<Ticker[]>;

  constructor(
    private tickerService: TickersService,
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
  }

  onSearchTicker(event: any){
    console.log(event.target.value);
    this.store.dispatch(searchTickersByCode(event.target.value));
  }
}
