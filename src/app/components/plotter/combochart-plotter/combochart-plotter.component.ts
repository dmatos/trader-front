import { Component, OnInit } from '@angular/core';
import {ChartType} from "angular-google-charts";

@Component({
  selector: 'app-combochart-plotter',
  templateUrl: './combochart-plotter.component.html',
  styleUrls: ['./combochart-plotter.component.css']
})
export class CombochartPlotterComponent{

  title = 'combochart';
  type = ChartType.ComboChart;
  data = [['09:05', 20, 28, 38, 45, 30]];
  options = {};

  constructor() { }
}
