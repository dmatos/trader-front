import {timestamp} from "rxjs";

export class DataPointModel{
  constructor(
    public timestamp: string,
    public value: number
  ) {}
}
