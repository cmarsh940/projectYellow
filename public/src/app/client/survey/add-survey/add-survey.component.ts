import { Survey } from './../../../models/survey';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { states } from '../../../models/states';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';
import { SurveyService } from '../../../services/survey.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Question } from '../../../models/question';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: "app-add-survey",
  templateUrl: "./add-survey.component.html",
  styleUrls: ["./add-survey.component.css"]
})
export class AddSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  newSurvey = new Survey();
  states = states;
  matcher = new MyErrorStateMatcher();
  question = new Question();
  questions: Question[];

  constructor(
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.surveyForm = this.fb.group({
      name: new FormControl("", [Validators.required]),
      questions: this.fb.array([this.initQuestion()])
    });
  }

  addQuestion() {
    const questionsControl = <FormArray>this.surveyForm.controls['questions'];
    questionsControl.push(this.initQuestion());
  }

  getQuestionName(i) {
    return `Question ${i + 1}`;
  }

  initQuestion() {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  removeQuestion(i) {
    const questionsControl = <FormArray>this.surveyForm.controls['questions'];
    questionsControl.removeAt(i);
  }

  submitForm(survey) {
    this._surveyService.addSurvey(survey).subscribe((data: any) => {
      this.router.navigate([`/survey/${data._id}`]);
    }, (error) => {
      console.log(error);
    });
  }
}
