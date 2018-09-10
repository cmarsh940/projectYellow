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

  updateSurvey(form: any) {
    this.errors = [];
    
    const formModel = form.value;

    const questionsDeepCopy: Question[] = formModel.questions.map(
      (question: Question) => Object.assign({}, question)
    );

    const savedSurvey: Survey = {
      _id: this.survey._id,
      category: this.survey.category,
      name: this.survey.name,
      questions: questionsDeepCopy,
      user: this.survey.user,
      creator: this.survey.creator,
      createdAt: this.survey.createdAt,
      updatedAt: this.survey.updatedAt
    };

    console.log("___ THE FORM ___", savedSurvey);
    this._surveyService.updateAnswer(this.survey._id, savedSurvey).toPromise()
      .then(() => {
        this.errorMessage = null;
        this._router.navigate(["/list_of_surveys"])
      })
      .catch((error) => {
          this.errorMessage = error;
      }
    )
  }
}