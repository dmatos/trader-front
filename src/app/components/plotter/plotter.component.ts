import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ChartState} from "../../store/chart/chart.state";
import {ActivatedRoute, Params} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {SettingsModel} from "../../model/settings.model";
import {Observable} from "rxjs";
import {SettingsState} from "../../store/settings/settings.state";
import {selectSettings} from "../../store/settings/settings.selector";

@Component({
  selector: 'app-plotter',
  templateUrl: './plotter.component.html',
  styleUrls: ['./plotter.component.css']
})
export class PlotterComponent implements OnInit{
  public tickerCode: string = '';
  public stockExchangeCode: string = '';
  public begin: string = '';
  public end: string = '';
  private settings$: Observable<any>;
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};

  constructor(
    private route: ActivatedRoute,
    private store: Store<Map<string, ChartState>>,
    private settingsStore: Store<SettingsState>,
    private titleService: Title
  ) {
    this.settings$ = this.settingsStore.pipe(select(selectSettings));
  }

  ngOnInit(): void {
    this.settings$.subscribe( (state) => {
      if(!!state["settings"]){
        this.settings = state;
      }
    });
    this.readParams(this.route.snapshot.params);
    this.readQueryParams(this.route.snapshot.queryParams);
    this.route.params.subscribe((params) =>{
      this.readParams(params);
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
    });
  }

  readParams(params: Params){
    this.tickerCode = params['tickerCode'];
    this.stockExchangeCode = params['stockExchangeCode'];
    this.titleService.setTitle(this.tickerCode+':'+this.stockExchangeCode);
  }

  readQueryParams(params: Params){
    this.begin = params['begin'];
    this.end = params['end'];
  }

  getCustomSettings(keys: string[]){
    let customSettings: SettingsModel[] = [];
    keys.forEach( key => {
      let setting = this.settings.settings.get(key);
      if(!!setting) customSettings.push(setting);
    })
    return customSettings;
  }
}
