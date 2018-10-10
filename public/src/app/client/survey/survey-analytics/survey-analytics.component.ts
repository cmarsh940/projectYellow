import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

import { AuthService } from './../../../auth/auth.service';
import { Question } from '../../../global/models/question';
import { SurveyService } from '../survey.service';
import { Survey } from '../../../global/models/survey';

@Component({
  selector: 'app-survey-analytics',
  templateUrl: './survey-analytics.component.html',
  styleUrls: ['./survey-analytics.component.css']
})
export class SurveyAnalyticsComponent implements OnInit, OnDestroy {
  survey: Survey = new Survey();
  questions: Question[];
  surveyId = '';
  _routeSubscription: Subscription;
  errors = [];
  url: string;


  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  
  constructor(
    private _surveyService: SurveyService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router,
    private location: Location,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  isLoggedIn() {
    let verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    }
  }

  getSurvey() {
    this._surveyService.getAsset(this.surveyId)
      .subscribe(res => {
          this.survey = res;
          this.questions = this.survey.questions;
          this.url = `www.surveysbyme.com/takeSurvey/${this.surveyId}`;
        },
        (error: any) => {
          if (error) {
            for (const key of Object.keys(error)) {
              const errors = error[key];
              this.errors.push(errors.message);
            }
          }
        }
      );
  }


  downloadJson() {
    const blob = new Blob([JSON.stringify(this.survey.questions)], { type: 'application/json' });
    saveAs(blob, 'survey.json');
  }
  downloadText() {
    const blob = new Blob([JSON.stringify(this.survey.questions)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'survey.txt');
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
