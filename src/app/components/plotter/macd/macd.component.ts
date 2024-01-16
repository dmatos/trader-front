import {Component, Input} from '@angular/core';
import {ChartModel} from "../../../model/chart.model";
import {
  GET_COMBO_MACD_AND_SIGNAL_BY_TICKER_CODE_AND_DATE_RANGE_SUCCESS_TYPE,
  getMacdAndSignal
} from "../../../store/chart/chart.actions";
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
import {DownloadCsvComponent} from "../download-csv/download-csv.component";
import {MacdService} from "../../../service/macd.service";
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-macd',
  templateUrl: './macd.component.html',
  styleUrls: ['./macd.component.css']
})
export class MacdComponent {

  private settings$: Observable<any>;
  private settings: SettingsState = {settings: new Map<string, SettingsModel>()};
  macdChartModel: ChartModel = this.getMacdAndSignal()
  public settingsComponent = SettingsComponent;
  private apexChartRenderer: ApexCharts | undefined;
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
    private titleService: Title,
    private macdService: MacdService
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
          let macdData:number[] = [];
          let signalData:number[] = [];
          let diff:number[] = [];
          this.macdChartModel.dataModel?.data.forEach((dataPoint) => {
            macdData.push(dataPoint[0]);
            signalData.push(dataPoint[1]);
            diff.push(dataPoint[2]);
          })
          let options = {
            chart: {
              type: "line",
              height: 150
            },
            stroke: {
              width: [1,1,4]
            },
            series: [
              {
                name: "macd",
                type: "line",
                data: macdData
              },
              {
                name: "signal",
                type: "line",
                data: signalData
              },
              {
                name: "histogram",
                type: "bar",
                data: diff
              }
            ],
            xaxis: {
              categories:  this.macdChartModel.dataModel?.timestamps,
              labels: {
                show: false
              }
            },
          };
          if(this.apexChartRenderer){
            this.apexChartRenderer.destroy();
          }
          this.apexChartRenderer = new ApexCharts(document.querySelector("#chart"), options);
          this.apexChartRenderer.render();
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
      'bar',
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

  onDownload(){
    const dialogRef = this.dialog.open(DownloadCsvComponent, {
      width: '350px',
      data: {
        settings: this.getSettings()
      },
    });
    dialogRef.afterClosed().subscribe((dateRange: any) => {
      if(!dateRange) return;
      const tf1 = this.settings.settings.get("macdTimeframe1")?.value;
      const tf2 = this.settings.settings.get("macdTimeframe2")?.value;
      const signal = this.settings.settings.get("macdSignalTimeframe")?.value;
      this.macdService.downloadCsv(this.stockExchangeCode, this.tickerCode, dateRange.start, dateRange.end, tf1, tf2, signal);
    });
  }
}
