import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SurveyService } from '../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs';
import { Question } from '../../../global/models/question';
import { Survey } from '../../../global/models/survey';
import { SurveyCategoryService } from '../../../overview/survey-category-report/survey-category.service';
import { SurveyCategory } from '../../../global/models/survey-category';
import { ErrorStateMatcher } from '@angular/material';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface questionType {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css']
})


export class EditSurveyComponent implements OnInit, OnDestroy {
  selectedValue: string;
  surveyForm: FormGroup;
  surveyId: string = "";
  nameChangeLog: string[] = [];
  categories: SurveyCategory[];
  type = "";
  errors = [];
  _routeSubscription: Subscription;

  questionTypes: any[] = [
    { value: "boolean", viewValue: "YES / NO" },
    { value: "boolean", viewValue: "True / False" },
    { value: "mutiplechoice", viewValue: "Multiple Choice" },
    { value: "text", viewValue: "Single Answer" },
    { value: "paragraph", viewValue: "User Feedback" }
  ];

  @Input() survey: Survey;

  constructor(
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private _categoryService: SurveyCategoryService,
    private _activatedRoute: ActivatedRoute,
    private location: Location,
    private _router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.loadCategories();
      this.getSurvey();
    })
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }
  

  getSurvey() {
    this._surveyService.getAsset(this.surveyId)
      .subscribe(res => {
        this.survey = res;
        if (this.surveyForm) {
          this.surveyForm.reset();
        }
        this.surveyForm.patchValue(this.survey);
        this.surveyForm.setControl('questions', this.fb.array(this.survey.questions || []));
        console.log("Survey form values", this.surveyForm.value);
      })
  }

  setupQuestions() {
    const questionsControl = <FormArray>this.surveyForm.controls["questions"];
    console.log("questionsControl",questionsControl);
      questionsControl.push(this.questions());
  }

  loadCategories(): Promise<any> {
    this.errors = [];
    const tempList = [];
    return this._categoryService.getAll().toPromise().then((result) => {
      this.errors = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.categories = tempList;
    }).catch((error) => {
      if (error) {
        for (const key of Object.keys(error)) {
          const errors = error[key];
          this.errors.push(errors.message);
        }
      }
    });
  }

  createForm() {
    this.surveyForm = this.fb.group({
      category: ["", Validators.required],
      name: ["", Validators.required],
      questions: this.fb.array([this.questions()])
    });
  }

  questions(): FormGroup {
    return this.fb.group({
      questionType: "",
      question: ["", Validators.required]
    });
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {
    this.surveyForm.reset({
      name: this.survey.name
    });
    this.setQuestions(this.survey.questions);
  }

  get question(): FormArray {
    return this.surveyForm.get("questions") as FormArray;
  }

  setQuestions(questions: Question[]) {
    const questionFGs = questions.map(question => this.fb.group(question));
    const questionsFormArray = this.fb.array(questionFGs);
    this.surveyForm.setControl("questions", questionsFormArray);
  }

  addQuestion() {
    const questionsControl = <FormArray>this.surveyForm.controls["questions"];
    questionsControl.push(this.questions());
  }

  removeQuestion(i) {
    const questionsControl = <FormArray>this.surveyForm.controls["questions"];
    questionsControl.removeAt(i);
  }

  submitForm() {
    this.errors = [];
    this.survey = this.prepareSaveSurvey();
    this._surveyService.updateAsset(this.survey._id, this.survey).subscribe(
      result => {
        console.log("___RESULTS___:", result);
        this._router.navigate(["/survey"]);
      },
      error => {
        console.log("___ERROR___:", error);
        for (const key of Object.keys(error)) {
          const errors = error[key];
          this.errors.push(errors.message);
        }
      });
    if (!this.errors) {
      this.rebuildForm();
      this._router.navigate(["/survey"]);
    }
  }

  prepareSaveSurvey(): Survey {
    const formModel = this.surveyForm.value;

    // deep copy of form model questions
    const questionsDeepCopy: Question[] = formModel.questions.map(
      (question: Question) => Object.assign({}, question)
    );

    // return new `Survey` object containing a combination of original survey value(s)
    // and deep copies of changed form model values
    const saveSurvey: Survey = {
      _id: this.survey._id,
      category: formModel.category as string,
      name: formModel.name as string,
      questions: questionsDeepCopy,
      user: this.survey.user,
      creator: this.survey.creator,
      createdAt: this.survey.createdAt,
      updatedAt: Date.now()
    };
    return saveSurvey;
  }

  revert() {
    this.rebuildForm();
  }

  cancel() {
    this.location.back();
  }
}