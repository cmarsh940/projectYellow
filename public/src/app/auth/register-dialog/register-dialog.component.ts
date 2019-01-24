import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { environment } from './../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Client } from 'src/app/global/models/client';

declare var FB: any;

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent implements OnInit {

  errors = [];
  responseData:any;
  private participant;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  constructor(
    private _authService: AuthService,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebookWhite.svg'));
  }

  ngOnInit() {
    this.loadFacebook();
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
    return new Promise((resolve, reject) => {
      const subscription = "FREE";
      const registerPlatform = 'FACEBOOK';
      FB.login((response: any) => {
        console.table(response);
        if (response.authResponse) {
          let authResponse = response.authResponse;
          FB.api('/me', { fields: 'email, first_name, last_name, picture' }, (data: any) => {
            let client = new Client();
            client.platformId = data.id
            client.email = data.email
            client.firstName = data.first_name;
            client.lastName = data.last_name;
            client.password = `Facebook${data.id}`;
            client.confirm_pass = `Facebook${data.id}`;
            client.picture = 'https://graph.facebook.com/' + data.id + '/picture?type=normal';
            client._subscription = subscription;
            client.registerPlatform = registerPlatform;
            client.platformAuth = authResponse.accessToken;
            resolve(client)
            this.addParticipant(client);
          });
        }
        else {
          console.log('User login failed');
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email,public_profile' })
      this.openSnackBar();
      this.dialogRef.close();
    })
  }


  cancel(): void {
    this.dialogRef.close();
  }

  addParticipant(response: any) {
    this.errors = [];
    this.participant = response;
    console.log("ADDING PARTICIPANT:", this.participant);
    this._authService.addParticipant(this.participant).subscribe((data) => {
      if (data.errors) {
        console.log("ERROR", data);
        this.errors.push(data.message);
      } else {
        console.log("ADDED DATA", data)
        this._authService.setCurrentClient(data);
        return data;
      }
    })
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("Thank you for registering", '', config);
  }
}
