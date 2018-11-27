import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

import { AuthService } from './../../../auth/auth.service';
import { Question } from '../../../global/models/question';
import { SurveyService } from '../survey.service';
import { Survey } from '../../../global/models/survey';

import * as Chart from 'chart.js';
import * as moment from 'moment';


@Component({
  selector: 'app-survey-analytics',
  templateUrl: './survey-analytics.component.html',
  styleUrls: ['./survey-analytics.component.css']
})
export class SurveyAnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {
  survey: Survey = new Survey();
  questions: Question[] = [];
  surveyId = '';
  _routeSubscription: Subscription;
  errors = [];
  url: string;
  pieData = [];
  average: number;
  loaded: Boolean;
  booleanAnswers: any[];

  chart: any;
  barChart: any;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  

  // TEST TIME
  constructor(
    private _surveyService: SurveyService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loaded = false;
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
    });
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    
  }

  isLoggedIn() {
    let verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    }
  }


  getSurvey() {
    this._surveyService.getAsset(this.surveyId).subscribe(res => {

      let alldates = res.submissionDates;
      let answeredDates = [];

      alldates.forEach((res) => {
        let jsdate = new Date(res)
        console.log("JSDATE", jsdate);
        answeredDates.push(jsdate.toLocaleTimeString('en', { month: 'short', day: 'numeric', year: 'numeric' }))
      })
      console.log("ANSWERED DATES", answeredDates);

      this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

      this.chart = new Chart(this.context, {
        type: 'line',
        data: {
          labels: answeredDates,
          datasets: [
            {
              data: answeredDates,
              borderColor: '#3cba9f',
              fill: true
            },
          ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                displayFormats: {
                  day: 'MMM DD'
                }
              }
            }]
          }
        }
      });

      // SET QUESTIONS
      this.survey = res.questions;
      console.log("SURVEY", this.survey);
      
      // SET URL FOR CLIENT
      this.url = `www.surveysbyme.com/takeSurvey/${this.surveyId}`;

      this.loopThroughQuestions();
      
    })
  }


  loopThroughQuestions() {
    for (let i = 0; i < (<any>this.survey).length; i++) {
      console.log("QUESTION TYPE", this.survey[i].questionType);

      // GENERATING AVERAGE
      if (this.survey[i].questionType === 'smilieFaces' || this.survey[i].questionType === 'satisfaction' || this.survey[i].questionType === 'rate' || this.survey[i].questionType === 'star') {
        this.questions.push(this.survey[i]);
        let b = 0
        let c = this.survey[i].answers.map(parseFloat);
        let d = 0
        for (let a = 0; a < this.survey[i].answers.length; a++) {
          b += c[a];
        }
        this.average = b / this.survey[i].answers.length;
        this.survey[i].answers = [];
        let avg = this.average.toString();
        this.survey[i].answers.push(avg);
      }

      //BOOLEANS
      else if (this.survey[i].questionType === 'boolean' || this.survey[i].questionType === 'yesno' || this.survey[i].questionType === 'likeunlike' || this.survey[i].questionType === 'goodbad') {
        this.questions.push(this.survey[i]);
        let e = 0
        let f = 0
        let g = this.survey[i].answers.map(Number);
        for (let a = 0; a < this.survey[i].answers.length; a++) {
          if (g[a] === 1) {
            e++;
            console.log("1", e);
          } else {
            f++;
            console.log("0", f);
          }
        }
        this.survey[i].answers = [];
        this.survey[i].answers.push([e,f]);
        console.log("BOOLEAN ANSWER", this.survey[i].answers);
        this.booleanAnswers = this.survey[i].answers;

        this.barChart = new Chart('bar', {
          type: 'bar',
          data: {
            labels: ["True", "False"],
            datasets: [
              {
                data: this.booleanAnswers[0],
                borderColor: '#3cba9f',
                borderWidth: 2,
                fill: false 
              }
            ]
          },
          options: {
            legend: {
              display:false
            },
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                stacked: true,
                gridLines: {
                  display: true,
                  color: "rgba(255,99,132,0.2)"
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false
                }
              }]
            }
          }
        })

      } else {
        this.questions.push(this.survey[i]);
      }
    }
  }

  downloadJson() {
    const blob = new Blob([JSON.stringify(this.survey)], { type: 'application/json' });
    saveAs(blob, 'survey.json');
  }

  downloadText() {
    const blob = new Blob([JSON.stringify(this.survey)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'survey.txt');
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("You are not logged in!", '', config);
  }

  back() {
    this.location.back();
  }
}
