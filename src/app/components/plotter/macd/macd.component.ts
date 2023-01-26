import {Component, Input} from '@angular/core';
import {ChartModel} from "../../../model/chart.model";
import {
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  getMacdAndSignal
} from "../../../store/chart/chart.actions";
import {ChartType} from "angular-google-charts";
import {select, Store} from "@ngrx/store";
import {ChartState} from "../../../store/chart/chart.state";
import {SettingsState} from "../../../store/settings/settings.state";
import {Observable} from "rxjs";
import {selectSettings} from "../../../store/settings/settings.selector";
import {SettingsModel} from "../../../model/settings.model";
import {ActivatedRoute, Params} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Title} from "@angular/platform-browser";
import {SettingsComponent} from "../settings/settings.component";

@Component({
  selector: 'app-macd',
  templateUrl: './macd.component.html',
  styleUrls: ['./macd.component.css']
})
export class MacdComponent {

  private settings$: Observable<any>;
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};
  macdChartModel: ChartModel = this.getMacdAndSignal()
  macdData: (string|number)[][]|undefined = undefined;
  public settingsComponent = SettingsComponent;
  private _KEYS = ["macdTimeframe1", "macdTimeframe2", "macdSignalTimeframe"];
  @Input() tickerCode: string = '';
  @Input() stockExchangeCode: string = '';
  @Input() begin: string = '';
  @Input() end: string = '';
  @Input() settingsModel: SettingsModel[] = [];
  searchString = '';

  constructor(
    private store: Store<Map<string, ChartState>>,
    private settingsStore: Store<SettingsState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private titleService: Title
  ){
    this.settings$ = this.settingsStore.pipe(select(selectSettings));
  }

  ngOnInit(): void {
    this.settings$.subscribe( (state) => {
      if(!!state["settings"]){
        this.settings = state;
      }
    });
    this.setSubscriptions();
    this.route.params.subscribe((params) =>{
      this.readParams(params);
    });
    this.route.queryParams.subscribe((params) => {
      this.readQueryParams(params);
    });
    this.dispatchMacdAndSignalAction(this.settingsModel);
  }

  readParams(params: Params){
    this.tickerCode = params['tickerCode'];
    this.stockExchangeCode = params['stockExchangeCode'];
    this.titleService.setTitle(this.tickerCode+':'+this.stockExchangeCode);
    this.setSubscriptions();
  }

  readQueryParams(params: Params){
    this.begin = params['begin'];
    this.end = params['end'];
    this.searchString = params['search']
    this.setSubscriptions();
  }

  setSubscriptions(){
    setTimeout( () => {
      this.macdChartModel.getObservable$().subscribe((data) => {
        const chartKey = this.macdChartModel?.chartKey;
        if (chartKey && this.macdChartModel && data.get(chartKey)) {
          this.macdChartModel.dataModel = data.get(chartKey)?.dataModel;
          this.macdData = this.macdChartModel.getDataAsArrayOfArrays();
        } else {
          this.macdData = undefined;
        }
      });
    }, 200);
  }

  getSettings(){
    if(!this._KEYS) return [];
    let customSettings: SettingsModel[] = [];
    this._KEYS.forEach( key => {
      let setting = this.settings.settings.get(key);
      if(!!setting) customSettings.push(setting);
    })
    return customSettings;
  }

  getMacdAndSignal(){
    return new ChartModel(
      'ComboMacdAndLine',
      GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
      ChartType.ComboChart,
      null,
      {
        seriesType: 'line',
        series: {1 : {type: 'line', color: '#2196f3'}},
        colors:['#000'],
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      this.getSettings(),
      this.store);
  }
  dispatchMacdAndSignalAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(getMacdAndSignal({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe1: this.settings?.settings.get("macdTimeframe1")?.value,
      timeframe2: this.settings?.settings.get("macdTimeframe2")?.value,
      signalTimeframe: this.settings?.settings.get("macdSignalTimeframe")?.value,
    }));
  }

  onSettings() {
    if (!!this.settingsComponent) {
      const dialogRef = this.dialog.open(this.settingsComponent, {
        width: '350px',
        data: {
          settings: this.getSettings()
        },
      });
      dialogRef.afterClosed().subscribe((settings: SettingsModel[]) => {
        this.dispatchMacdAndSignalAction(settings);
        this.setSubscriptions();
      });
    }
  }
}
