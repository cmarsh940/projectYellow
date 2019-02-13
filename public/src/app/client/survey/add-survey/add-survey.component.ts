import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Location } from '@angular/common';

import { SurveyService } from '../survey.service';
import { SurveyCategory } from '@shared/models/survey-category';
import { questionGroups, Question } from '@shared/models/question-group';
import { Survey } from '@shared/models/survey';



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
export class AddSurveyComponent implements OnInit {
  selectedQType: any;
  surveyForm: FormGroup;
  nameChangeLog: string[] = [];
  categories: SurveyCategory[];
  type = '';
  errors = [];

  questionGroups = questionGroups;
  checked: boolean;
  reward: boolean;

  @Input() survey: Survey;

  pc: boolean;

  constructor(
    private fb: FormBuilder,
    // private _authService: AuthService,
    // private _categoryService: SurveyCategoryService,
    private _surveyService: SurveyService,
    private _router: Router,
    private location: Location
  ) {
    this.checked = false;
    this.reward = false;
    this.createForm();
  }

  ngOnInit() {
    this.checkCount();
    this.loadCategories();
    this.checkPC();
  }

  loadCategories() {
    // this.errors = [];
    // const tempList = [];
    // return this._categoryService.getAll().toPromise().then((result) => {
    //   this.errors = null;
    //   result.forEach(asset => {
    //     tempList.push(asset);
    //   });
    //   this.categories = tempList;
    // }).catch((error) => {
    //   if (error) {
    //     for (const key of Object.keys(error)) {
    //       const errors = error[key];
    //       this.errors.push(errors.message);
    //     }
    //   }
    // });
  }

  checkCount() {
    // const count = this._authService.checkCount();
    // if (!count) {
    //   console.log('reported');
    //   this.location.back();
    // } else {
    //   console.log('COUNT');
    // }
  }

  checkPC() {
    // this.pc = false;
    // const checked = this._authService.checkPC();
    // if (checked) {
    //   this.pc = true;
    // } else {
    //   this.pc = false;
    // }
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
      private: [''],
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

// tslint:disable-next-line: use-life-cycle-interface
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
        this._router.navigate(['/survey']);
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
        this._router.navigate(['/survey']);
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
      private: formModel.private,
      questions: questionsDeepCopy,
      user: '',
      creator: JSON.parse(sessionStorage.getItem('currentClient')),
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
