import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { environment } from './../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Client } from '@shared/models/client';
import { takeUntil } from 'rxjs/operators';

declare const FB: any;
declare const gapi: any;

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})

/**
TODO:
- [] change google and facebook to just icons
*/

export class RegisterDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  FB: any;
  gapi: any;
  errors = [];
  responseData: any;
  private participant;
  auth2: any;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  errorData: boolean;

  private unsubscribe$ = new Subject();

  constructor(
    private _authService: AuthService,
    public snackBar: MatSnackBar,
    private _router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any
  ) {
    iconRegistry.addSvgIcon('facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebookWhite.svg'));
    iconRegistry.addSvgIcon('google',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg'));
  }

  ngOnInit() {
    this.errorData = false;
    this.loadFacebook();
  }

  ngAfterViewInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.clientId,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('glogin'));
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (data) => {
        const subscription = 'FREE';
        const registerPlatform = 'G';
        const authResponse = data.Zi;
        const client = new Client();
        client.platformId = data.El;
        client.email = data.w3.U3;
        client.firstName = data.w3.ofa;
        client.lastName = data.w3.wea;
        client.password = `Google${data.w3.Eea}`;
        client.confirm_pass = `Google${data.w3.Eea}`;
        client.picture = data.w3.Paa;
        client._subscription = subscription;
        client.registerPlatform = registerPlatform;
        client.platformAuth = authResponse.id_token;

        this.addGoogleParticipant(client);
        console.log('ADDED AND RETURNING');
      }, function (error) {
        console.log('GOOGLE LOGIN ERROR', error);
        this.errors = error;
      });
  }


  loadFacebook() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: environment.facebookId,
        cookie: true,
        xfbml: true,
        version: environment.facebookVersion
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      // tslint:disable-next-line: prefer-const
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin() {
    return new Promise((resolve, reject) => {
      const subscription = 'FREE';
      const registerPlatform = 'F';
      FB.login((response: any) => {
        if (response.authResponse) {
          const authResponse = response.authResponse;
          FB.api('/me', { fields: 'email, first_name, last_name, picture' }, (data: any) => {
            const client = new Client();
            client.platformId = data.id;
            client.email = data.email;
            client.firstName = data.first_name;
            client.lastName = data.last_name;
            client.password = `Facebook${data.id}`;
            client.confirm_pass = `Facebook${data.id}`;
            client.picture = 'https://graph.facebook.com/' + data.id + '/picture?type=normal';
            client._subscription = subscription;
            client.registerPlatform = registerPlatform;
            client.platformAuth = authResponse.accessToken;
            resolve(client);
            this.addParticipant(client);
          });
        } else {
          console.log('User login failed');
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email,public_profile' });
      if (this.errorData) {
        console.log('error with errorData');
      } else {
        this.openSnackBar();
        this.dialogRef.close();
      }
    });
  }


  cancel(): void {
    this.dialogRef.close();
  }

  addParticipant(response: any) {
    this.errorData = false;
    this.errors = [];
    this.participant = response;
    this._authService.addParticipant(this.participant).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      console.log('add participant data', data);
      if (data.errors) {
        console.log('ERROR', data);
        let dataError = data.message;
        this.errorData = true;
        this.errorSnackBar(dataError);
      } else {
        this._authService.setCurrentClient(data);
        window.location.href = environment.redirectLoginUrl;
      }
    });
  }

  addGoogleParticipant(response: any) {
    this.errorData = false;
    this.errors = [];
    this.participant = response;
    this._authService.addParticipant(this.participant).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      if (data.errors) {
        console.log('ERROR', data);
        this.errors = data.message;
        this.errorData = true;
      } else {
        this._authService.setCurrentClient(data);
        window.location.href = environment.redirectLoginUrl;
      }
    });
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('Thank you for registering', '', config);
  }

  errorSnackBar(data: any) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['error-snackbar'];
    this.snackBar.open(data, '', config);
  }
}
