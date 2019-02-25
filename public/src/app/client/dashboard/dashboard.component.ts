import { Location, isPlatformBrowser } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';
import { ProfileService } from '../profile/profile.service';

import * as Chart from 'chart.js';
import * as moment from 'moment';
import { Client } from '@shared/models/client';
import { AuthService } from 'app/auth/auth.service';
import { UniversalStorage } from '@shared/storage/universal.storage';

/**
TODO:
  - [] display or hide chart depending on payed or not
*/
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errors: any;
  loaded: boolean;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  client: Client = new Client;
  length = 0;
  id = this.universalStorage.getItem('t940');
  allSurveys: any;
  isBrowser: any;

  // CHART
  chart: any;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;



  constructor(
    private universalStorage: UniversalStorage,
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
   }

  ngOnInit() {
      this.loaded = true;
      this.getClient();
  }

  isLoggedIn() {
    const verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    }
  }

  getClient() {
    this._profileService.getparticipant(this.id).subscribe(res => {
      this.client = res;
      this.allSurveys = res._surveys;
      const answeredTempDates = {};
      const tempDates = [];
      const timeFormat = 'MM/DD/YYYY';
      if (res._surveys.length !== 0) {
        this.length = res._surveys.length;
      } else {
        this.length = 0;
      }
      for (let i = 0; i < this.allSurveys.length; i++) {
        const element = this.allSurveys[i];
        for (let j = 0; j < element.submissionDates.length; j++) {
          const temp = element.submissionDates[j];
          const date = moment(temp).format(timeFormat);
          tempDates.push(date);
        }
      }

      console.log(tempDates);

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
              label: 'Volume',
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
                major: {
                  fontStyle: 'bold',
                  fontColor: '#FFF'
                }
              }
            }],
            yAxes: [{
              display: false,
              scaleLabel: {
                display: true,
                labelString: 'Volume'
              }
            }]
          }
        }
      });
    });
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
