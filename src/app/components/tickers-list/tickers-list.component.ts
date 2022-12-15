import {Component, OnInit} from '@angular/core';
import {Ticker} from "../../model/ticker.model";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {getAllTickers, selectTicker} from "../../store/tickers/tickers-list.actions";
import {selectTickers} from "../../store/tickers/tickers-list.selector";
import {TickersState} from "../../store/tickers/tickers-list.state";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css']
})
export class TickersListComponent implements OnInit {
  tickers$: Observable<TickersState>;
  public tickers: Ticker[];
  public filteredTickers: Ticker[];
  public date: string;
  public tickerCode: string;
  public stockExchangeCode: string;
  public duration: number = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TickersState>) {
    this.tickers$ = this.store.pipe(select(selectTickers));
    this.tickers = this.filteredTickers = [];
    this.date = new Date().toISOString();
    this.tickerCode = "";
    this.stockExchangeCode = "";
  }

  ngOnInit(): void {
    this.getAllTickers();
    this.tickers$.subscribe((state) => {
      this.tickers = this.filteredTickers = state.tickers;
    });
    this.readParams(this.route.snapshot.params);
    this.readQueryParams(this.route.snapshot.queryParams);
    this.route.params.subscribe((params) => {
      this.readParams(params);
      this.dispatchSelectTickerAction();
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
      this.dispatchSelectTickerAction();
    });
  }

  readParams(params: Params){
    if(!!params['tickerCode']){
      this.tickerCode = params['tickerCode'];
    }
    if(!!params['stockExchangeCode']){
      this.stockExchangeCode = params['stockExchangeCode'];
    }
  }

  readQueryParams(params: Params){
    if(!!params['duration']){
      this.duration = +params['duration'];
    }
    if(!!params['begin']){
      this.date = params['begin'].slice(0,10);
    }
  }

  getAllTickers(){
    this.store.dispatch(getAllTickers());
  }

  onInputChange(){
    this.onSelectTicker(this.tickerCode, this.stockExchangeCode);
  }

  getBeginString(){
    let begin = new Date(this.date);
    let beginStr = begin.toISOString();
    return beginStr.replace(/(T..:..)/, 'T00:00');
  }

  getEndString(){
    let end = new Date(this.date);
    let endStr = end.toISOString();
    return endStr.replace(/(T..:..)/, 'T23:59');
  }

  onSelectTicker(tickerCode: string, stockExchangeCode: string){
    this.tickerCode = tickerCode;
    this.stockExchangeCode = stockExchangeCode;
    this.dispatchSelectTickerAction();
  }

  dispatchSelectTickerAction(){
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.getBeginString(),
      end: this.getEndString(),
      duration: this.duration}));
    const path = `${this.stockExchangeCode}/${this.tickerCode}`;
    this.router.navigate([{outlets: {primary: path, plotter: path}}], {queryParams: {begin: this.getBeginString(), end:this.getEndString(), duration: this.duration}});
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
