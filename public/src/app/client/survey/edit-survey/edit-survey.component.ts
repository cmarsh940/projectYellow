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
  myForm: FormGroup;
  survey = new Survey();
  newSurvey: Survey = new Survey();
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

  // updateSurvey(survey) {
  //   this.errors = [];
  //   console.log("___ THE FORM ___", this.survey);
  //   this._surveyService.updateAsset(this.survey._id, this.survey).toPromise()
  //     .then(() => {
  //       this.errorMessage = null;
  //       this._router.navigate(["/survey"])
  //     })
  //     .catch((error) => {
  //       if (error === 'Server error') {
  //         this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
  //       } else if (error === '404 - Not Found') {
  //         this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
  //       } else {
  //         this.errorMessage = error;
  //       }
  //     });
  // }

  updateSurvey(form: any) {
    this.errors = [];
    return this._surveyService.updateAsset(this.survey._id, this.survey).subscribe(res => {
      console.log("UPDATE RES",res);
      this._router.navigate(["/survey"]);
    });

  }

  
  // updateSurvey(survey) {
  //   this.errors = [];
  //   console.log("___ THE FORM ___", this.survey);
  //   this._surveyService.updateAsset(this.survey._id, this.survey).toPromise()
  //     .then(() => {
  //       this.errorMessage = null;
  //       this._router.navigate(["/survey"])
  //     })
  //     .catch((error) => {
  //       if (error === 'Server error') {
  //         this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
  //       } else if (error === '404 - Not Found') {
  //         this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
  //       } else {
  //         this.errorMessage = error;
  //       }
  //     });
  // }

  cancel() {
    this.location.back();
  }
}

