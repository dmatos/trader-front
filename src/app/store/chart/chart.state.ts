import {ChartDataModel} from "../../model/chart-data.model";

export interface ChartsMapState{
  charts: Map<String, ChartState>
}

export interface ChartState{
  title: string,
  dataModel: ChartDataModel
}
