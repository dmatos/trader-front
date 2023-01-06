import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ChartModel} from "../../../model/chart.model";
import {ChartState} from "../../../store/chart/chart.state";
import {ChartType} from "angular-google-charts";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/overlay";
import {SettingsModel} from "../../../model/settings.model";
import {SettingsComponent} from "./settings/settings.component";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartMapState$: Observable<Map<string, ChartState | undefined>> = new Observable<Map<string, ChartState>>();
  chartModel: ChartModel | null = null;
  public data: (string | number)[][] = [];
  public defaultType = ChartType.ComboChart;
  public settingsComponent: ComponentType<SettingsComponent> | undefined;
  public callBack$: Subject<any>;

  constructor(public dialog: MatDialog) {
    this.callBack$ = new Subject<any>();
  }

  ngOnInit(): void {
    this.data = [];
    if (!this.chartModel || !this.chartMapState$) {
      console.error('ChartModel not initialized for ChartComponent.')
      this.data = [];
      return;
    }
    this.chartMapState$ = this.chartModel.getObservable$();
    this.chartMapState$.subscribe((chartMapState) => {
      if (!this.chartModel || !chartMapState) {
        this.data = [];
        return;
      }
      const newChartState = chartMapState.get(this.chartModel.chartKey);
      if (!!newChartState) {
        if (!this.chartModel) {
          this.data = [];
          return;
        }
        this.chartModel.dataModel = newChartState.dataModel;
        this.chartModel.title = newChartState.title;
        this.data = this.chartModel ? this.chartModel.getDataAsArrayOfArrays() : [];
      } else {
        this.data = [];
      }
    });
  }

  onSettings() {
    if (!!this.settingsComponent) {
      const dialogRef = this.dialog.open(this.settingsComponent, {
        width: '350px',
        data: {
          settings: this.chartModel?.settings,
        },
      });
      dialogRef.afterClosed().subscribe((settings: SettingsModel[]) => {
        this.callBack$.next(settings);
      });
    }
  }
}
