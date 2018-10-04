import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../auth/auth.service';
import { Client } from '../../global/models/client';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';

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

  private chartData: Array<any>;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { 
    this.isLoggedIn();

    setTimeout(() => {
      this.generateData();

      // change the data periodically
      setInterval(() => this.generateData(), 3000);
    }, 1000);
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
        `Index ${i}`,
        Math.floor(Math.random() * 100)
      ]);
    }
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
