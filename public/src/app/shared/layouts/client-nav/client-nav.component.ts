import { AuthService } from 'app/auth/auth.service';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { ClientService } from 'app/client/client.service';

@Component({
  selector: 'app-client-nav',
  templateUrl: './client-nav.component.html',
  styleUrls: ['./client-nav.component.css']
})

export class ClientNavComponent implements OnInit, OnDestroy {
  currentClient = this.universalStorage.getItem('t940');
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  opened: boolean;
  notifications: any;
  private unsubscribe$ = new Subject();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private universalStorage: UniversalStorage,
    private _authService: AuthService,
    private _clientService: ClientService,
    private breakpointObserver: BreakpointObserver,
    private _router: Router,
    public snackBar: MatSnackBar
  ) {
  }

  async ngOnInit() {
    await this.getNotifications();
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

   getNotifications() {
    this._clientService.getNotifications(this.currentClient).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      if (data === null || data === undefined || data === [] ) {
        this.notifications = [];
      } else {
        this.notifications = data;
      }
      console.log('notifications are:', this.notifications);
    });
  }

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
    this.snackBar.open('You are logged out', '', config );
  }
}
