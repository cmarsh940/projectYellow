import { Location } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';
import { ProfileService } from '../profile/profile.service';

import * as Chart from 'chart.js';
import * as moment from 'moment';
import { Client } from '@shared/models/client';
import { AuthService } from 'app/auth/auth.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errors: any;
  currentClient: Client = new Client;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  client = JSON.parse(localStorage.getItem('currentClient'));
  length = 0;

  // CHART
  chart: any;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;



  constructor(
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoggedIn();
    if (this.client.s.length !== 0) {
      this.length = this.client.s.length;
    } else {
      this.length = 0;
    }

    const allSurveys = this.client.s;
    console.log('ALL SURVEYS', allSurveys);
    const answeredTempDates = {};
    const tempDates = [];

    allSurveys.forEach((survey) => {
      survey.submissionDates.forEach(element => {
        const date = moment(element).format('l');
        tempDates.push(date);
      });
    });
    console.log(tempDates);

    tempDates.forEach(function (x) {
      answeredTempDates[x] = (answeredTempDates[x] || 0) + 1;
    });
    console.log('ANSWERED TEMP DATES', answeredTempDates);

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
            data: dateValues,
            label: 'Volume',
            borderColor: gradient,
            hoverBorderColor: '#ffff52',
            backgroundColor: '#fdff0066',
            fill: true
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
            display: true,
            gridLines: {
              color: '#FFFFFF'
            },
            ticks: {
              fontColor: '#FFFFFF'
            },
            type: 'time',
            time: {
              displayFormats: {
                day: 'MMM DD'
              }
            }
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    });
  }

  isLoggedIn() {
    const verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    }
  }

  getClient() {
    this._profileService.getparticipant(this.client._id).subscribe((client: Client) => {

      console.log('CLIENT RETURNED', client),
      this.currentClient = client;
    },
      (error: any) => {
        if (error) {
          for (const key of Object.keys(error)) {
            const errors = error[key];
            this.errors.push(errors.message);
          }
        }
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
