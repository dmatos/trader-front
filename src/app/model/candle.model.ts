export class CandleModel{
  constructor(
    public high: number = 0,
    public low: number = 0,
    public open: number = 0,
    public close: number = 0,
    public begin: string = '',
    public end: string = '',
    public lowOrHigh: number = 0) {
  }
}
