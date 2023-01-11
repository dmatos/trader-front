import {Component, OnInit} from '@angular/core';
import {Ticker} from "../../model/ticker.model";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {getAllTickers, selectTicker} from "../../store/tickers/tickers-list.actions";
import {selectTickers} from "../../store/tickers/tickers-list.selector";
import {TickersState} from "../../store/tickers/tickers-list.state";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {getMacdAndSignal} from "../../store/chart/chart.actions";
import {SettingsState} from "../../store/settings/settings.state";
import {selectSettings} from "../../store/settings/settings.selector";

@Component({
  selector: 'app-tickers-list',
  templateUrl: './tickers-list.component.html',
  styleUrls: ['./tickers-list.component.css']
})
export class TickersListComponent implements OnInit {
  tickers$: Observable<TickersState>;
  settings$: Observable<any>;
  public tickers: Ticker[];
  private settings: SettingsState | undefined = undefined;
  public filteredTickers: Ticker[];
  public date: any;
  public tickerCode: string;
  public searchStr: any = '';
  public stockExchangeCode: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TickersState>,
    private settingsStore: Store<SettingsState>) {
    this.tickers$ = this.store.pipe(select(selectTickers));
    this.settings$ = this.settingsStore.pipe(select(selectSettings));
    this.tickers = this.filteredTickers = [];
    this.date = new Date().toISOString();
    this.tickerCode = "";
    this.stockExchangeCode = "";
  }

  ngOnInit(): void {
    this.getAllTickers();
    this.tickers$.subscribe((state) => {
      this.tickers = this.filteredTickers = state.tickers;
      if(!!this.searchStr){
        this.filterTickers(this.searchStr);
      }
    });
    this.settings$.subscribe((state) => {
      if(!!state["settings"]){
        this.settings = state;
      }
    });
    this.readParams(this.route.snapshot.params);
    this.readQueryParams(this.route.snapshot.queryParams);
    this.route.params.subscribe((params) => {
      this.readParams(params);
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
    });
  }

  filterTickers(searchStr: string){
    this.searchStr = searchStr;
    const code = this.searchStr.toUpperCase();
    this.filteredTickers = this.tickers.filter(t => t.code.match('.*'+code+'.*') || t.stockExchangeCode.match('.*'+code+'.*'));
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
    if(!!params['begin']){
      this.date = params['begin'].slice(0,10);
    }
    if(!!params['search']){
      this.filterTickers(params['search']);
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
    const begin: string = this.getBeginString();
    const end: string = this.getEndString();
    this.store.dispatch(selectTicker({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: begin,
      end: end,
      duration: this.settings?.settings.get("chartDuration")?.value
    }));
    this.store.dispatch(getMacdAndSignal({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: begin,
      end: end,
      duration1: this.settings?.settings.get("macdDuration1")?.value,
      duration2: this.settings?.settings.get("macdDuration2")?.value,
      signalDuration: this.settings?.settings.get("macdSignalDuration")?.value,
    }))
    const path = `${this.stockExchangeCode}/${this.tickerCode}`;
    this.router.navigate([{outlets: {primary: path, plotter: path}}], {queryParams: {begin: this.getBeginString(), end:this.getEndString(), search: this.searchStr}});
  }

  onSearchTicker(){
    if(this.searchStr){
      const code = this.searchStr.toUpperCase();
      this.filteredTickers = this.tickers.filter(t => t.code.match('.*'+code+'.*') || t.stockExchangeCode.match('.*'+code+'.*'));
    } else {
      this.getAllTickers();
    }
  }
}
