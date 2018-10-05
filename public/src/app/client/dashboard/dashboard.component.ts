import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../auth/auth.service';
import { Client } from '../../global/models/client';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';

var donutData = {
  'data': [
    {
      'name': 'donutChart',
      'values': [
        { 'c': '<5', 'y': 2704659 },
        { 'c': '5-13', 'y': 4499890 },
        { 'c': '14-17', 'y': 2159981 },
        { 'c': '18-24', 'y': 3853788 },
        { 'c': '25-44', 'y': 14106543 },
        { 'c': '45-64', 'y': 8819342 },
        { 'c': '≥65', 'y': 612463 }
      ]
    }
  ],
};


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  currentClient: Client = new Client;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  client = JSON.parse(sessionStorage.getItem('currentClient'));

  chartData: Array<any>;
  donutChartData: Array<any>;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { 
    this.isLoggedIn();
    this.generateData();
    this.generateDonutData();
  }

  isLoggedIn() {
    let verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    }
  }

  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([
        `${i}`,
        Math.floor(Math.random() * 100)
      ]);
    }
  }

  generateDonutData() {
    this.donutChartData = donutData.data;
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
