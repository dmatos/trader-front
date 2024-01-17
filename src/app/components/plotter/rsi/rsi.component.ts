import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {SettingsState} from "../../../store/settings/settings.state";
import {SettingsModel} from "../../../model/settings.model";
import {ChartModel} from "../../../model/chart.model";
import {select, Store} from "@ngrx/store";
import {ChartState} from "../../../store/chart/chart.state";
import {ActivatedRoute, Params} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Title} from "@angular/platform-browser";
import {selectSettings} from "../../../store/settings/settings.selector";
import {SettingsComponent} from "../settings/settings.component";
import {GET_RSI_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE, getRSI} from "../../../store/chart/chart.actions";
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-rsi',
  templateUrl: './rsi.component.html',
  styleUrl: './rsi.component.css'
})
export class RsiComponent {
  private settings$: Observable<any>;
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};
  rsiChartModel: ChartModel = this.getRsi();
  public settingsComponent = SettingsComponent;
  private _KEYS = ["numberOfCandles", "chartTimeframe"];
  private apexChartRenderer: ApexCharts | undefined;
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
    private titleService: Title,
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
    this.dispatchRSIAction(this.settingsModel);
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
    setTimeout(
      () => {
        this.rsiChartModel.getObservable$().subscribe((data) => {
          const chartKey = this.rsiChartModel?.chartKey;
          if (chartKey && this.rsiChartModel && data.get(chartKey)) {
            this.rsiChartModel.dataModel = data.get(chartKey)?.dataModel;
            let dataToPlot: number[] = [];
            let fifties: number[] = [];
            let tirties: number[] = [];
            let seventies: number[] = [];
            this.rsiChartModel.dataModel?.data.forEach( (value: number[]) => {
              dataToPlot.push(value[0]);
              fifties.push(50);
              tirties.push(30);
              seventies.push(70);
            });
            let options = {
              chart: {
                type: "line",
                height: 150
              },
              stroke: {
                width: [2,1,1,1]
              },
              yaxis: {
                min: 0,
                max: 100
              },
              series: [
                {
                  name: "RSI",
                  type: "line",
                  data: dataToPlot
                },
                {
                  name: "50",
                  type: "line",
                  data: fifties
                },
                {
                  name: "30",
                  type: "line",
                  data: tirties
                },
                {
                  name: "70",
                  type: "line",
                  data: seventies

                }
              ],
              xaxis: {
                categories:  this.rsiChartModel.dataModel?.timestamps,
                labels: {
                  show: false
                }
              },
            };
            if(this.apexChartRenderer){
              this.apexChartRenderer.destroy();
            }
            this.apexChartRenderer = new ApexCharts(document.querySelector("#rsi"), options);
            this.apexChartRenderer .render();
          }
        })
  }, 200);
  }

  dispatchRSIAction(settings: SettingsModel[]){
    if(!settings) return;
    this.store.dispatch(getRSI({
      tickerCode: this.tickerCode,
      stockExchangeCode: this.stockExchangeCode,
      begin: this.begin,
      end: this.end,
      timeframe: this.settings?.settings.get("chartTimeframe")?.value,
      numberOfCandles: this.settings?.settings.get("numberOfCandles")?.value
    }));
  }

  getRsi(){
    return new ChartModel(
      'RSI',
      GET_RSI_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
      'line',
      null,
      {
        seriesType: 'line',
        series: {1 : {type: 'line', color: '#2196f3'}, 2: {type: 'bars', color: '#2196f3', opacity: '0.1', strokeOpacity: '0.1'}},
        colors:['#000'],
        hAxis: {slantedText:true, slantedTextAngle:90, textStyle: {fontSize: 10}}
      },
      this.getSettings(),
      this.store);
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

  onSettings(){
    if (!!this.settingsComponent) {
      const dialogRef = this.dialog.open(this.settingsComponent, {
        width: '350px',
        data: {
          settings: this.getSettings()
        },
      });
      dialogRef.afterClosed().subscribe((settings: SettingsModel[]) => {
        this.dispatchRSIAction(settings);
        this.setSubscriptions();
      });
    }
  }

  onDownload(){

  }
}
