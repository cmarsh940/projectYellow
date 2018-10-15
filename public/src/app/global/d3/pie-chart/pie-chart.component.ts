declare var require: any
import { Component, OnInit, EventEmitter, Input, ElementRef } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import * as $ from 'jquery';
import { Question } from '../../models/question';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  title = 'Pie Chart';
  @Input() data: any;
  @Input() width: number;
  @Input() height: number;

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private radius: number;

  private arc: any;
  private labelArc: any;
  private pie: any;
  private color: any;
  private svg: any;
  private innerRadius = 20;
  private arcGenerator: any;
  private pieGenerator: any;
  private arcOver: any;


  constructor() {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width - 140, this.height) / 2;
  }

  ngOnInit() {
    console.log("PIE DATA", this.data);
    this.sentData();
    this.initSvg();
    this.drawPie();
  }

  sentData() {
    let Data = [
      { name: 'Yes', value: 0 },
      { name: 'No', value: 0 }
    ]
    for (let i = 0; i < this.data.length; i++) {
        for (let j = 0; j < this.data[i].answers.length; j++) {
          if (this.data[i].answers[j] === '1') {
            Data[0].value++
          } else {
            Data[1].value++
          }
        }
        console.log("DATA", Data);
        this.data = Data;
        console.log("set data", this.data);
      } 
    }
  
  private initSvg() {
    this.color = d3Scale.scaleOrdinal()
      .range(['#ffeb3b', '#ff5722', '#8bc34a', '#009688', '#03a9f4', '#3f51b5', '#3f51b5']);
    this.arc = d3Shape.arc()
      .outerRadius(this.radius)
      .innerRadius(this.innerRadius);

    this.arcGenerator = d3.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.radius);

    this.arcOver = d3Shape.arc()
      .outerRadius(this.radius + 20)
      .innerRadius(40);
    this.labelArc = d3Shape.arc()
      .outerRadius(this.radius - 100)
      .innerRadius(this.radius - 100);
    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.value);

    this.svg = d3.select('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr('viewBox', "0 0 " + (this.width) + ' ' + (this.height))
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')').classed("svg-content", true);

  }

  private drawPie() {
    let g = this.svg.selectAll('.arc')
      .data(this.pie(this.data))
      .enter().append('g')
      .attr('class', 'arc');
    g.append('path').attr('d', this.arc)
      .style('fill', (d: any) => this.color(d.data.name))
      .style('stroke', '#ffffff') // border of pie
      .style('transform', 'scale(.95,.95)')
  }

}
