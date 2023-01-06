export class SettingsModel{
  constructor(
    public name: string,
    public value: any,
    public text: string,
    public type: string //input type
  ) {
  }
}
