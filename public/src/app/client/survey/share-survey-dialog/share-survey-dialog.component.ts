import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

declare const FB: any;
@Component({
  selector: 'app-share-survey-dialog',
  templateUrl: './share-survey-dialog.component.html',
  styleUrls: ['./share-survey-dialog.component.css']
})
export class ShareSurveyDialogComponent implements OnInit {

  // FACEBOOK
  FB: any;
  userLink: string;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ShareSurveyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    iconRegistry.addSvgIcon('facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebookWhite.svg'));
   }

  ngOnInit() {
    this.userLink = `https://surveysbyme.com/takeSurvey/${this.data}`;
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
      // tslint:disable-next-line: prefer-const
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  facebookPost() {
    console.log('hit post to facebook');

    FB.ui({
      method: 'share',
      mobile_iframe: true,
      href: this.userLink
    }, function (response) {
      console.log('post to facebook response', response);
      if (response && !response.error_message) {
        alert('Posting completed.');
      } else {
        alert('Error while posting.');
      }
    });
  }

}
