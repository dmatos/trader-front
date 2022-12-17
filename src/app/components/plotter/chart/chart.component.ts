import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ChartModel} from "../../../model/chart.model";
import {ChartState} from "../../../store/chart/chart.state";
import {ChartType} from "angular-google-charts";

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

  ngOnInit(): void {
    if (!!this.chartModel && !!this.chartMapState$) {
      this.chartMapState$ = this.chartModel.getObservable$();
      this.chartMapState$.subscribe((chartMapState) => {
        if(!this.chartModel || !chartMapState){
          return;
        }
        const newChartState = chartMapState.get(this.chartModel.chartKey);
        if(!!newChartState) {
          if(!this.chartModel){
            return;
          }
          this.chartModel.dataModel = newChartState.dataModel;
          this.chartModel.title = newChartState.title;
          this.data = this.chartModel?this.chartModel.getDataAsArrayOfArrays():[];
        } else {
          console.error("no data on newChartModel");
        }
      });
    } else {
      console.error('ChartModel not initialized for ChartComponent.')
    }
  }
}
