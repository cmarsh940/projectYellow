import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Client } from './../../global/models/client';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: "client-nav",
  templateUrl: "./client-nav.component.html",
  styleUrls: ["./client-nav.component.css"]
})

export class ClientNavComponent {
  currentClient = JSON.parse(localStorage.getItem('t940')); 
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  opened: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _authService: AuthService,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {}

  logout(): void {
    this._authService.logout((res) => {
      this.openSnackBar();
      this.currentClient = null;
      this._router.navigateByUrl('/');
    });
  }
  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("You are logged out", '', config );
  }
}
