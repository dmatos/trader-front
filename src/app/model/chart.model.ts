import {ChartType} from "angular-google-charts";
import {DefaultProjectorFn, MemoizedSelector, select, Store} from "@ngrx/store";
import {ChartDataModel} from "./chart-data.model";
import {ChartState} from "../store/chart/chart.state";
import {selectChart} from "../store/chart/chart.selector";

export class ChartModel{
  private selector = selectChart;
  constructor(
    public title: string,
    public chartKey: string,
    public chartType: ChartType,
    public dataModel: ChartDataModel | null | undefined,
    public options: {},
    private store: Store<Map<string, ChartState|undefined>>
  ) {
  }

  getObservable$(){
    return this.store.pipe(select(this.selector));
  }

  getDataAsArrayOfArrays() {
    let arrayOfArrays: ((string | number)[])[] = [];
    if (this.dataModel) {
      for (let index = 0; index < this.dataModel.timestamps.length; index++) {
        const el = this.dataModel.timestamps[index];
        arrayOfArrays.push([el]);
        arrayOfArrays[index] = arrayOfArrays[index].concat(this.dataModel.data[index]);
      }
    }
    return arrayOfArrays;
  }
}
