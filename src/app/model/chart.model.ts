import {ChartType} from "angular-google-charts";
import {DefaultProjectorFn, MemoizedSelector, select, Store} from "@ngrx/store";
import {ChartDataModel} from "./chart-data.model";
import {ChartState} from "../store/chart/chart.state";

export class ChartModel{
  constructor(
    public title: string,
    public type: ChartType,
    public dataModel: ChartDataModel | null | undefined,
    public options: {},
    private selector:  MemoizedSelector<object, ChartState, DefaultProjectorFn<ChartState | undefined>>,
    private store: Store<ChartState>
  ) {
  }

  getObservable(){
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
