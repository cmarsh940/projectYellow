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
  data = JSON.parse(sessionStorage.getItem('currentClient'));
  
  cards = [
    { title: 'Activity', cols: 2, rows: 1 },
    { title: 'Surveys', cols: 2, rows: 1 },
    { title: 'Users', cols: 2, rows: 1 },
    { title: 'Custom', cols: 2, rows: 1 }
  ];

  constructor(
    private _authService: AuthService,
    private _router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { 
    console.log(this.data);
  }

  isLoggedIn() {
    let verify = this._authService.verify();
    console.log("VERIFY:", verify);
    if(verify == false) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    } else {
      console.log("You are verified");
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
}
