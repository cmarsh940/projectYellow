import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '../../global/models/survey';
import { Subscription } from 'rxjs';
import { Question } from '../../global/models/question';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { SurveyCategory } from '../../global/models/survey-category';
import { SurveyCategoryService } from '../../overview/survey-category-report/survey-category.service';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit, OnDestroy {
  selectedValue: string;
  surveyForm: FormGroup;
  surveyId: string = "";
  nameChangeLog: string[] = [];
  categories: SurveyCategory[];
  errors = [];
  storeanswers = [];
  _routeSubscription: Subscription;

  questionTypes: any[] = [
    { value: "boolean", viewValue: "YES / NO" },
    { value: "mutiplechoice", viewValue: "Multiple Choice" },
    { value: "text", viewValue: "User Feedback" }
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
        this.surveyForm.patchValue(this.survey);
      })
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

  questions() {
    return this.fb.group({
      questionType: "",
      question: ["", Validators.required],
      answers: ["", Validators.required]
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
    return this.surveyForm.get("question") as FormArray;
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
    this._surveyService.updateAnswer(this.survey._id, this.survey).subscribe(
      result => {
        console.log("___RESULTS___:", result);
        this._router.navigate(["/list_of_surveys"]);
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
      this._router.navigate(["/list_of_surveys"]);
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