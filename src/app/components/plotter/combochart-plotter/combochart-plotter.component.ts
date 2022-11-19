import { Component, OnInit } from '@angular/core';
import {ChartType} from "angular-google-charts";

@Component({
  selector: 'app-combochart-plotter',
  templateUrl: './combochart-plotter.component.html',
  styleUrls: ['./combochart-plotter.component.css']
})
export class CombochartPlotterComponent implements OnInit {

  title = 'Fruits distribution';
  type = ChartType.ComboChart;
  data = [
    ["Apples", 3, 2, 2.5],
    ["Oranges",2, 3, 2.5],
    ["Pears", 1, 5, 3],
    ["Bananas", 3, 9, 6],
    ["Plums", 4, 2, 3]
  ];
  columnNames = ['Fruits', 'Jane','Jone','Average'];
  options = {
    hAxis: {
      title: 'Person'
    },
    vAxis:{
      title: 'Fruits'
    },
    seriesType: 'bars',
    series: {2: {type: 'line'}}
  };
  width = 550;
  height = 400;

  constructor() { }

  ngOnInit(): void {
  }

}
