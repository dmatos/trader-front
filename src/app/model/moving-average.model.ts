export class MovingAverageModel{
  constructor(
    public timestamp: string,
    public value: number
  ) {
  }
}

export class MovingAveragesResponseModel{
  constructor(
    public movingAverages: MovingAverageModel[]
  ) {
  }
}
