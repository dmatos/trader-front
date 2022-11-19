import { Component, OnInit } from '@angular/core';
import {
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartSelectionChangedEvent,
  ChartType,
  GoogleChartComponent,
  GoogleChartsModule
} from "angular-google-charts";

@Component({
  selector: 'app-piechart-plotter',
  templateUrl: './piechart-plotter.component.html',
  styleUrls: ['./piechart-plotter.component.css']
})
export class PiechartPlotterComponent {

  title = 'Browser market shares at a specific website, 2014';
  type = ChartType.PieChart
  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7]
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
  };
  width = 550;
  height = 400;


  constructor() { }

}
