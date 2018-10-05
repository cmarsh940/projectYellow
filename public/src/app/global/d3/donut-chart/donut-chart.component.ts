import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
  @ViewChild('donutChart') private chartContainer: ElementRef;
  @Input() data: Array<any>;

  constructor() {}


  ngOnInit() {
    console.table(this.data);
  }
  
}