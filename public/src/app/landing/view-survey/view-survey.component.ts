import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '../../global/models/survey';
import { Subscription } from 'rxjs';
import { Question } from '../../global/models/question';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  survey: Survey;
  questions: Question[];
  subscription: Subscription;
  errorMessage;
  errors = [];

  private asset;

  constructor(
    private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _surveyService: SurveyService
  ) {
    // this.formGroup = this.fb.group({
    //   category: [""],
    //   name: [""],
    //   questions: this.fb.array([
    //     this.fb.control('')
    //   ])
    // });
  }

  ngOnInit() {
    this.getSurvey();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSurvey() {
    this.subscription = this._activatedRoute.params.subscribe(params =>
      this._surveyService.getAsset(params.id).toPromise()
        .then((result) => {
          this.errorMessage = null;
          this.survey = result;
          this.questions = this.survey.questions;
        })
        .catch((error) => {
          console.log("GET SURVEY ERROR", error)
          this.errorMessage = error;
        })
      )
  }

  updateSurvey(): void {
    this.errors = [];
    this._surveyService.updateAnswer(this.survey._id, this.survey);
  }
  // updateSurvey(): void {
  //   this.errors = [];
  //   this._surveyService.updateAnswer(this.survey, res => {
  //     if (res.errors) {
  //       for (const key of Object.keys(res.errors)) {
  //         const errors = res.errors[key];
  //         this.errors.push(errors.message);
  //       }
  //     }
  //     let r = window.confirm("Thank you for you response");
  //     if (r == true) {
  //       this._router.navigate(["/"]);
  //     } else {
  //       window.close();
  //     }
  //   });
  // }

}