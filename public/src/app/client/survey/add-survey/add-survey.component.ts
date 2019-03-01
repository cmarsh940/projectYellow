import { Component, OnInit, Input, OnChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Location, isPlatformBrowser } from '@angular/common';

import { SurveyService } from '../survey.service';
import { SurveyCategory } from '@shared/models/survey-category';
import { questionGroups, Question } from '@shared/models/question-group';
import { Survey } from '@shared/models/survey';
import { AuthService } from 'app/auth/auth.service';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { SurveyCategoryService } from 'app/overview/survey-category-report/survey-category.service';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css']
})
export class AddSurveyComponent implements OnInit, OnChanges {
  selectedQType: any;
  surveyForm: FormGroup;
  nameChangeLog: string[] = [];
  categories: SurveyCategory[];
  clientId: any;
  type = '';
  errors = [];
  count: any;
  questionGroups = questionGroups;
  checked: boolean;
  reward: boolean;

  @Input() survey: Survey;

  pc: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private _authService: AuthService,
    private _categoryService: SurveyCategoryService,
    private _surveyService: SurveyService,
    private universalStorage: UniversalStorage,
    private _router: Router,
    private location: Location
  ) {
    this.checked = false;
    this.reward = false;
    this.createForm();
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.clientId = this.universalStorage.getItem('t940');
      await this.check();
      this.loadCategories();
    }
  }

  loadCategories() {
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

  check() {
    this.pc = false;
    return this._authService.check(this.clientId).then(data => {
      if (data.c8o1 <= 0) {
        console.log('you dont have any more surveys', data.c8o1);
        this.location.back();
      } else {
        console.log('count is good');
        if (data.b8o1 !== 'FREE') {
          console.log('Subscribed');
          this.pc = true;
        } else {
          console.log('Trial');
          this.pc = false;
        }
      }
    });
  }

  choice(qType) {
    console.log('CHANGED QUESTION TYPE', qType);
    this.selectedQType = qType;
  }

  createForm() {
    this.surveyForm = this.fb.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      experationDate: [''],
      incentive: [''],
      layout: ['', Validators.required],
      private: [''],
      public: [''],
      questions: this.fb.array([this.initQuestion()])
    });
  }
  initQuestion() {
    return this.fb.group({
      isRequired: false,
      questionType: ['', Validators.required],
      question: ['', Validators.required],
      options: this.fb.array([this.initOption()])
    });
  }
  initOption() {
    return this.fb.group({
      optionName: [''],
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
    return this.surveyForm.get('question') as FormArray;
  }
  get option(): FormArray {
    return this.surveyForm.get('option') as FormArray;
  }

  setQuestions(questions: Question[]) {
    const questionFGs = questions.map(question => this.fb.group(question));
    const questionFormArray = this.fb.array(questionFGs);
    this.surveyForm.setControl('questions', questionFormArray);
  }

  addQuestion() {
    const questionsControl = <FormArray>this.surveyForm.controls['questions'];
    questionsControl.push(this.initQuestion());
  }

  addOption() {
    const optionsControl = <FormArray>this.surveyForm.controls['options'];
    optionsControl.push(this.initOption());
  }

  addNewOption(control) {
    control.push(
      this.fb.group({
        optionName: ['']
      }));
  }

  removeQuestion(i) {
    const questionsControl = <FormArray>this.surveyForm.controls['questions'];
    questionsControl.removeAt(i);
  }

  submitForm() {
    this.errors = [];
    this.survey = this.prepareSaveSurvey();
    this._surveyService.addAsset(this.survey).subscribe(
      result => {
        if (result) {
          this._router.navigate(['/dashboard/survey']);
        } else {
          console.log('ADDING SURVEY ERRO', result);
        }
      },
      error => {
        console.log('___ERROR___:', error);
          for (const key of Object.keys(error)) {
            const errors = error[key];
            this.errors.push(errors.message);
          }
      });
      if (!this.errors) {
        this.rebuildForm();
        this._router.navigate(['/dashboard/survey']);
      }
    }

  prepareSaveSurvey(): Survey {
    const formModel = this.surveyForm.value;

    // deep copy of form model lairs
    const questionsDeepCopy: Question[] = formModel.questions.map(
      (question: Question) => Object.assign({}, question)
    );

    // return new `Survey` object containing a combination of original survey value(s)
    // and deep copies of changed form model values
    const saveSurvey: Survey = {
      _id: Number,
      category: formModel.category._id,
      name: formModel.name as string,
      submissionDates: [],
      lastSubmission: Date.now(),
      experationDate: formModel.experationDate,
      incentive: formModel.incentive,
      layout: formModel.layout,
      private: formModel.private,
      public: formModel.public,
      questions: questionsDeepCopy,
      user: '',
      creator: JSON.parse(localStorage.getItem('currentClient')),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return saveSurvey;
  }

  revert() {
    this.rebuildForm();
  }

  OnChange($event) {
    this.reward = $event.checked;
  }

}
