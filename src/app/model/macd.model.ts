import {DataPointModel} from "./data-point.model";

export class MacdResponseModel{
  constructor(
    public macd: DataPointModel[],
    public signal: DataPointModel[]
  ) {
  }
}
