import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs';
import { Question } from '../../../global/models/question';
import { Survey } from '../../../global/models/survey';

@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css']
})
export class EditSurveyComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  survey: Survey;
  questions: Question[];
  _routeSubscription: Subscription;
  errorMessage;
  errors = [];
  surveyId: string = "";

  constructor(
    private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private location: Location,
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
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  getSurvey() {
    this._surveyService.getAsset(this.surveyId)
      .subscribe(res => {
        this.survey = res
      });
  }

  updateSurvey(): void {
    this.errors = [];
    this._surveyService.updateAsset(this.survey, res => {
      if (res.errors) {
        for (const key of Object.keys(res.errors)) {
          const errors = res.errors[key];
          this.errors.push(errors.message);
        }
      } else {
        this._router.navigate(["/survey"]);
      }
    });
  }

  cancel() {
    this.location.back();
  }
}

