import { AuthService } from './../auth.service';
import { FormControl, Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Client } from "../../global/models/client";
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatIconRegistry } from '@angular/material';
import { environment } from './../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

declare var FB: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errors: string[] = [];
  client: Client;
  myForm: FormGroup;
  currentClient: Client;
  errorMessage;
  loaded: Boolean;
  hide = true;

  private participant;


  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email") ? "Not a valid email" : "";
  }

  constructor(
    private _authService: AuthService, 
    private _router: Router,
    public snackBar: MatSnackBar, 
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    fb: FormBuilder
  ) {
    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebookWhite.svg'));

    this.myForm = fb.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit() {
    this.loaded = false;
    this.verified();
    this.loadFacebook();
    this.loaded = true;
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
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
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
            let client = new Client();
            client.email = data.email
            client.password = `Facebook${data.id}`;
            resolve(client)
            this.loginFacebookParticipant(client);
          });
        }
        else {
          console.log('User login failed');
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email,public_profile' })
      setTimeout(() => {
        this.loaded = true;
        this._router.navigateByUrl("/dashboard");
      }, 5000);
    })
  }

  loginFacebookParticipant(data: any) {
    this.errors = [];
    console.log("*** STARTING FACEBOOK LOGIN ***", data)
    this.participant = {
      'email': data.email,
      'password': data.password
    };

    this._authService.authenticate(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log("___ LOGIN ERROR ___:", data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
            return;
          }
        } else {
          this._authService.setCurrentClient(data);
          return data;
        }
      } else {
        this.errors = data;
        return data;
      }
    });
  }

  loginParticipant(form: any) {
    this.errors = [];
    console.log("*** STARTING LOGIN ***")
    this.participant = {
      'email': this.email.value,
      'password': this.password.value
    };

    this._authService.authenticate(this.participant).subscribe((data) => {
      if(data) {
        if (data.errors) {
          console.log("___ LOGIN ERROR ___:");
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
          }
          // this.errors.push(data.errors);
        } else {
          if (data.a8o1 === "CAPTAIN") {
            this._authService.setCurrentClient(data);
            this._router.navigateByUrl("/overview");
          } else {
            this._authService.setCurrentClient(data); 
            this._router.navigateByUrl("/dashboard");
          }
        }
      } else {
        this.errors = data;
      }
    });
  }

  verified() {
    this.loaded = false;
    let data = this._authService.emailVerified();
    if (data) {
      console.log("VERIFIED");
      this.alreadyLoggedIn();
    } else {
      console.log("Need to verify email");
      return;
    }
  }

  alreadyLoggedIn() {
    let data = this._authService.checkLoggedIn();
      if (data) {
        this.openSnackBar();
        this._router.navigateByUrl("/dashboard");
      }
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("You are already logged in!", '', config);
  }
  openFacebookSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("You are already logged in!", '', config);
    this._router.navigateByUrl("/dashboard");
  }
}
