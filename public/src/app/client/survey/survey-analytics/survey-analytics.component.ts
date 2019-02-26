import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Survey } from '@shared/models/survey';
import { Question } from '@shared/models/question-group';
import { SurveyService } from '../survey.service';
import { AuthService } from 'app/auth/auth.service';

import * as Chart from 'chart.js';
import * as moment from 'moment';


function flatten(arr) {
  return [].concat(...arr);
}
function deepFlatten(arr) {
  return flatten(           // return shalowly flattened array
    arr.map(x =>             // with each x in array
      Array.isArray(x)      // is x an array?
        ? deepFlatten(x)    // if yes, return deeply flattened x
        : x                 // if no, return just x
    )
  );
}

@Component({
  selector: 'app-survey-analytics',
  templateUrl: './survey-analytics.component.html',
  styleUrls: ['./survey-analytics.component.css']
})
export class SurveyAnalyticsComponent implements OnInit, OnDestroy {
  survey: Survey = new Survey();
  questions: Question[] = [];
  surveyId = '';
  surveyName: string;
  _routeSubscription: Subscription;
  errors = [];
  url: string;
  pieData = [];
  average: number;
  loaded: Boolean;
  booleanAnswers: any[];
  countAvgAnswers: number;
  private: any;
  total: any;
  timeTotal: any;
  surveyAvg: any;
  title: string;
  lvl: any;
  isBrowser: any;

  timeSinceLastSubmission: any;

  chart: any;
  barChart: any;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  // tslint:disable-next-line: max-line-length
  colors = ['#ffd600', '#ffab00', '#ff6d00', '#ff3d00', '#c51162', '#536dfe', '#2979ff', '#0091ea', '#00b8d4', '#00bfa5', '#00c853', '#64dd17', '#aeea00'];

  displayedColumns = ['optionName', 'count', 'percentage'];

  constructor(
    private _surveyService: SurveyService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
   }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loaded = false;
      this._routeSubscription = this._activatedRoute.params.subscribe(params => {
        this.surveyId = params['id'];
        this.getSurvey();
      });
      setTimeout(() => {
        this.loaded = true;
      }, 3000);
    }
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  isLoggedIn() {
    const verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    }
  }


  getSurvey() {
    this._surveyService.getAsset(this.surveyId).subscribe(res => {
      this.surveyName = res.name;
      const alldates = res.submissionDates;
      const answeredTempDates = {};
      const tempDates = [];
      const timeFormat = 'MM/DD/YYYY';
      this.lvl = res.creator._subscription;
      if (this.lvl !== 'FREE') {
        // tslint:disable-next-line: no-shadowed-variable
        alldates.forEach((res) => {
          const date = moment(res).format(timeFormat);
          tempDates.push(date);
        });

        tempDates.forEach(function (x) {
          answeredTempDates[x] = (answeredTempDates[x] || 0) + 1;
        });

        let chartDates = [];
        Object.entries(answeredTempDates).forEach(
          ([key, value]) => {
          let objectDate = {
            x: new Date(key),
            y: value
          };
          chartDates.push(objectDate);
          }
        );

        const dateValues = Object.values(answeredTempDates);
        const dateNames = Object.keys(answeredTempDates);



        // TODAYS DATE
        const todaysDate = moment().format();

        const submissionTimeResults = moment(todaysDate).diff(moment(res.lastSubmission));

        // LAST SUBMISSION IN HOURS
        this.timeSinceLastSubmission = moment.duration(submissionTimeResults).as('hours');

        // INITIALIZE CHART FROM HTML
        this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

        const gradient = this.context.createLinearGradient(0, 0, 320, 0);
        gradient.addColorStop(0, '#ffd600');
        gradient.addColorStop(0.4, '#ffff52');
        gradient.addColorStop(0.9, '#ffd600');
        gradient.addColorStop(1, '#ffff52');

        this.context.fillStyle = gradient;

        // GENERATE CHART AND COMPONENTS
        this.chart = new Chart(this.context, {
          type: 'line',
          data: {
            labels: dateNames,
            datasets: [
              {
                data: chartDates,
                label: this.surveyName,
                borderColor: gradient,
                hoverBorderColor: '#ffff52',
                backgroundColor: '#fdff0066',
                fill: false
              },
            ]
          },
          options: {
            legend: {
              display: false,
            },
            responsive: true,
            animation: {
              duration: 0, // general animation time
            },
            hover: {
              animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
            layout: {
              padding: {
                top: 20,
                bottom: 0
              }
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'day'
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                },
                ticks: {
                  fontColor: '#FFFFFF'
                },
                gridLines: {
                  color: '#FFFFFF'
                }
              }],
              yAxes: [{
                display: false,
                scaleLabel: {
                  display: true,
                  labelString: 'Volume'
                }
              }]
            },
            title: {
              display: true,
              text: 'Survey Volume'
            }
          }
        });
      }

      // SET KEY ANALYTICS
      this.title = res.name;
      this.private = res.private;
      this.total = res.totalAnswers;
      // tslint:disable-next-line: no-bitwise
      this.timeTotal = `${res.surveyTime / 60 ^ 0}:` + res.surveyTime % 60;
      // tslint:disable-next-line: no-bitwise
      this.surveyAvg = `${res.averageTime / 60 ^ 0}:` + res.averageTime % 60;


      // SET QUESTIONS
      this.survey = res.questions;

      // SET URL FOR CLIENT
      this.url = `www.surveysbyme.com/takeSurvey/${this.surveyId}`;

      // LOOP THROUGH QUESTIONS
      this.loopThroughQuestions();

    });
  }

  loopThroughQuestions() {
    for (let i = 0; i < (<any>this.survey).length; i++) {
      // tslint:disable-next-line: max-line-length
      if (this.survey[i].questionType === 'smilieFaces' || this.survey[i].questionType === 'satisfaction' || this.survey[i].questionType === 'rate' || this.survey[i].questionType === 'star') {
        let b = 0;
        const c = this.survey[i].answers.map(parseFloat);
        const d = 0;

        // TOTAL NUMBER OF ANSWERS TO CALCULATE
        this.countAvgAnswers = this.survey[i].answers.length;

        for (let a = 0; a < this.survey[i].answers.length; a++) {
          b += c[a];
        }
        this.average = b / this.survey[i].answers.length;
        const avg = this.average.toString();
        this.survey[i].answers = [];
        this.survey[i].answers.push(avg);
        this.questions.push(this.survey[i]);
      // tslint:disable-next-line: max-line-length
      } else if (this.survey[i].questionType === 'boolean' || this.survey[i].questionType === 'yesno' || this.survey[i].questionType === 'likeunlike' || this.survey[i].questionType === 'goodbad') {
        let percentE: number;
        let e = 0;
        let percentF: number;
        let f = 0;
        const g = this.survey[i].answers.map(Number);
        for (let a = 0; a < this.survey[i].answers.length; a++) {
          if (g[a] === 1) {
            e++;
          } else {
            f++;
          }
        }
        percentE = (e * 100) / this.survey[i].answers.length;
        const finalPercentE = Math.round(percentE);
        percentF = (f * 100) / this.survey[i].answers.length;
        const finalPercentF = Math.round(percentF);
        this.survey[i].answers = [];
        this.survey[i].answers.push([e, finalPercentE, f, finalPercentF]);
        this.questions.push(this.survey[i]);
      } else if (this.survey[i].questionType === 'dropDownMultiple') {
        console.log('_*_*_* MULTIPLE DROP DOWN QUESTION *_*_*_', this.survey[i]);

        const options = this.survey[i].options;

        // FLATTEN NESTED ARRAY OF ANSWERS
        const tempAnswers = deepFlatten(this.survey[i].answers);
        console.log('TEMP ANSWERS', tempAnswers);
        // LOOP THROUGH ANSWERS AND OPTIONS AND COUNT HOW MANY OF EACH
        tempAnswers.forEach(answer => {
          options.forEach(option => {
            if (option.optionName === answer) {
              const randomNum = Math.floor(Math.random() * 12) + 0;
              if (!option.count) {
                option.count = 1;
                option.color = this.colors[randomNum];
                return;
              } else {
                option.count = option.count + 1;
                return;
              }
            }
          });
        });
        options.forEach(option => {
          if (!option.count) {
            option.percentage = 0;
            console.log(`Option count is ${option.count} the percentage is ${option.percentage}`);
            return;
          } else {
            const tempPercent = (option.count / tempAnswers.length) * 100;
            console.log('TEMP PERCENT', tempPercent);
            option.percentage = Math.round(tempPercent);
            console.log(`Option count is ${option.count} the percentage is ${option.percentage}`);
            return;
          }
        });
        // SET NEW OPTIONS AND PUTH THEM TO THE QUESTIONS ANSWERS
        this.survey[i].answers = options;
        this.questions.push(this.survey[i]);
      // tslint:disable-next-line: max-line-length
      } else if (this.survey[i].questionType === 'multiplechoice' || this.survey[i].questionType === 'multiplechoiceOther' || this.survey[i].questionType === 'dropDown') {
        const options = this.survey[i].options;
        const tempAnswers = this.survey[i].answers;

        // LOOP THROUGH ANSWERS AND OPTIONS AND COUNT HOW MANY OF EACH
        tempAnswers.forEach(answer => {
          options.forEach(option => {
            if (option.optionName === answer) {
              const randomNum = Math.floor(Math.random() * 12) + 0;
              if (!option.count) {
                option.count = 1;
                option.color = this.colors[randomNum];
              } else {
                option.count = option.count + 1;
              }
            }
          });
        });

        options.forEach(option => {
          if (!option.count) {
            option.percentage = 0;
            console.log(`Option count is ${option.count} the percentage is ${option.percentage}`);
            return;
          } else {
            const tempPercent = (option.count / tempAnswers.length) * 100;
            console.log('TEMP PERCENT', tempPercent);
            option.percentage = Math.round(tempPercent);
            console.log(`Option count is ${option.count} the percentage is ${option.percentage}`);
            return;
          }
        });
        // SET NEW OPTIONS AND PUTH THEM TO THE QUESTIONS ANSWERS
        this.survey[i].answers = options;
        this.questions.push(this.survey[i]);
      } else {
        this.questions.push(this.survey[i]);
      }
    }
  }

  downloadJson(): void {
  }

  downloadText(): void {
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('You are not logged in!', '', config);
  }

  back() {
    this.location.back();
  }
}
