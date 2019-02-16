import { AuthService } from './../auth.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatIconRegistry } from '@angular/material';
import { environment } from './../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Client } from '@shared/models/client';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare const FB: any;
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  errors: string[] = [];
  client: Client;
  myForm: FormGroup;
  currentClient: Client;
  errorMessage;
  loaded: Boolean;
  hide = true;
  auth2: any;

  private participant;


  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  getErrorMessage() {
    return this.email.hasError('required')
      ? 'You must enter a value'
      : this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(
    private _authService: AuthService,
    private _router: Router,
    public snackBar: MatSnackBar,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // const svgFacebookUrl = 'assets/icons/facebookWhite.svg';
    // const svgGoogleUrl = 'assets/icons/google.svg';
    // const domain = (isPlatformServer(platformId)) ? 'http://localhost:4000/' : '';
    // iconRegistry.addSvgIcon(
    //   'facebook',
    //   sanitizer.bypassSecurityTrustResourceUrl(domain + svgFacebookUrl));
    // iconRegistry.addSvgIcon(
    //   'google',
    //   sanitizer.bypassSecurityTrustResourceUrl(domain + svgGoogleUrl));

    this.myForm = fb.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.errors = null;
      this.loaded = false;
      this.verified();
      this.loadFacebook();
      this.loaded = true;
    }
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

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (data) => {
        console.log('LOGGEDINUSER:', data);
        const client = new Client();
        client.email = data.w3.U3;
        client.password = `Google${data.w3.Eea}`;
        this.loginGoogleParticipant(client);
      }, function (error) {
        console.log('GOOGLE LOGIN ERROR', error);
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
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin() {
    this.loaded = false;
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        console.table(response);
        if (response.authResponse) {
          FB.api('/me', { fields: 'email, first_name, last_name, picture' }, (data: any) => {
            const client = new Client();
            client.email = data.email;
            client.password = `Facebook${data.id}`;
            resolve(client);
            this.loginFacebookParticipant(client);
          });
        } else {
          console.log('User login failed');
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email,public_profile' });
      setTimeout(() => {
        this.loaded = true;
        this._router.navigateByUrl('/dashboard');
      }, 5000);
    });
  }

  loginGoogleParticipant(data: any) {
    this.errors = null;
    console.log('*** STARTING GOOGLE LOGIN ***', data);
    this.participant = {
      'email': data.email,
      'password': data.password
    };

    this._authService.authenticate(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ LOGIN ERROR ___:', data.errors);
          this.errors = data;
        } else {
          this._authService.setCurrentClient(data);
          window.location.href = environment.redirectLoginUrl;
        }
      } else {
        this.errors = data;
        return data;
      }
    });
  }
  loginFacebookParticipant(data: any) {
    this.errors = null;
    console.log('*** STARTING FACEBOOK LOGIN ***', data);
    this.participant = {
      'email': data.email,
      'password': data.password
    };

    this._authService.authenticate(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ LOGIN ERROR ___:', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
            return;
          }
        } else {
          this._authService.setCurrentClient(data);
          window.location.href = environment.redirectLoginUrl;
        }
      } else {
        this.errors = data;
        return data;
      }
    });
  }

  loginParticipant(form: any) {
    this.errors = null;
    console.log('*** STARTING LOGIN ***');
    this.participant = {
      'email': this.email.value,
      'password': this.password.value
    };

    this._authService.authenticate(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ LOGIN ERROR ___:');
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
          }
          // this.errors.push(data.errors);
        } else {
          // if (data.a8o1 === 'CAPTAIN') {
          //   this._authService.setCurrentClient(data);
          //   this._router.navigateByUrl('/overview');
          // } else {
            this._authService.setCurrentClient(data);
            this._router.navigateByUrl('/dashboard');
          // }
        }
      } else {
        this.errors = data;
      }
    });
  }

  verified() {
    // this.loaded = false;
    // const data = this._authService.emailVerified();
    // if (data) {
    //   console.log('VERIFIED');
    //   this.alreadyLoggedIn();
    // } else {
    //   console.log('Need to verify email');
    //   return;
    // }
  }

  alreadyLoggedIn() {
    // const data = this._authService.checkLoggedIn();
    //   if (data) {
    //     this.openSnackBar();
    //     this._router.navigateByUrl('/dashboard');
    //   }
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('You are already logged in!', '', config);
  }
  openFacebookSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('You are already logged in!', '', config);
    this._router.navigateByUrl('/dashboard');
  }
}
