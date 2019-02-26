import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material';
import { AuthService } from 'app/auth/auth.service';
import { UniversalStorage } from '@shared/storage/universal.storage';

@Component({
  selector: 'app-overview-nav',
  templateUrl: './overview-nav.component.html',
  styleUrls: ['./overview-nav.component.css']
})
export class OverviewNavComponent {
  currentClient = this.universalStorage.getItem('t940');
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  opened: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private universalStorage: UniversalStorage,
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
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('You are logged out', '', config);
  }
}
