import {DataPointModel} from "./data-point.model";

export class RsiResponseModel{
  constructor(public rsiValuesList: DataPointModel[]) {
  }
}
