
import { SurveyCategory } from '../../../global/models/survey-category';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Question } from '../../../global/models/question';
import { Survey } from '../../../global/models/survey';
import { SurveyCategoryService } from '../../../overview/survey-category-report/survey-category.service';
import { SurveyService } from '../survey.service';


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
  selector: "app-add-survey",
  templateUrl: "./add-survey.component.html",
  styleUrls: ["./add-survey.component.css"]
})
export class AddSurveyComponent implements OnInit {
  selectedValue: string;
  surveyForm: FormGroup;
  nameChangeLog: string[] = [];
  categories: SurveyCategory[];
  type = "";
  errors = [];

  questionTypes: Type[] = [
    { value: "boolean", viewValue: "YES / NO" },
    { value: "mutiplechoice", viewValue: "Multiple Choice" },
    { value: "text", viewValue: "User Feedback" }
  ];

  @Input() survey: Survey;

  constructor(
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private _categoryService: SurveyCategoryService,
    private _router: Router
  ) {
    this.createForm();
    this.logNameChange();
  }

  ngOnInit() {
    this.loadCategories();
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
      questions: this.fb.array([this.initQuestion()])
    });
  }
  initQuestion() {
    return this.fb.group({
      type: "",
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
    return this.surveyForm.get("question") as FormArray;
  }

  setQuestions(questions: Question[]) {
    const questionFGs = questions.map(question => this.fb.group(question));
    const questionFormArray = this.fb.array(questionFGs);
    this.surveyForm.setControl("questions", questionFormArray);
  }

  addQuestion() {
    const questionsControl = <FormArray>this.surveyForm.controls["questions"];
    questionsControl.push(this.initQuestion());
  }

  removeQuestion(i) {
    const questionsControl = <FormArray>this.surveyForm.controls["questions"];
    questionsControl.removeAt(i);
  }

  submitForm() {
    this.errors = [];
    this.survey = this.prepareSaveSurvey();
    this._surveyService.addAsset(this.survey).subscribe(
      result => {
        console.log("___RESULTS___:",result);
        this._router.navigate(["/survey"]);
      },
      error => {
        console.log("___ERROR___:",error);
          for (const key of Object.keys(error)) {
            const errors = error[key];
            this.errors.push(errors.message);
          }
      });
      if(!this.errors) {
        this.rebuildForm();
        this._router.navigate(["/survey"]);
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
      category: formModel.category as string,
      name: formModel.name as string,
      questions: questionsDeepCopy,
      answers: [""],
      user: "",
      creator: JSON.parse(sessionStorage.getItem('currentClient')),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return saveSurvey;
  }

  revert() {
    this.rebuildForm();
  }

  logNameChange() {
    const nameControl = this.surveyForm.get("name");
    nameControl.valueChanges.forEach((value: string) =>
      this.nameChangeLog.push(value)
    );
  }
}