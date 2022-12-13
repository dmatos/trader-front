import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ChartModel} from "../../../model/chart.model";
import {ChartState} from "../../../store/chart/chart.state";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {

  chartState$: Observable<ChartState | undefined> = new Observable<undefined>();
  public chartModel: ChartModel | null = null;
  public data: (string | number)[][] = [];

  ngOnInit(): void {
    if (this.chartModel !== null && this.chartState$ !== undefined) {
      this.chartState$ = this.chartModel.getObservable();
      this.chartState$.subscribe((chartState) => {
        if(!this.chartModel || !chartState){
          return;
        }
        this.chartModel.dataModel = chartState.dataModel;
        this.chartModel.title = chartState.title;
        this.data = this.chartModel.getDataAsArrayOfArrays();
      });
    } else {
      console.error('ChartModel not initialized for ChartComponent.')
    }
  }

  ngOnDestroy() {
    console.error("oh no! I'm destroyed...");
  }

}
