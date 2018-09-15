import { SurveyCategory } from '../../../global/models/survey-category';
import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, FormControlName } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { SurveyCategoryService } from '../../../overview/survey-category-report/survey-category.service';
import { SurveyService } from '../survey.service';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../../../global/generic-validator';
import { Survey } from '../../../global/models/survey';


@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css']
})


export class EditSurveyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  surveyForm: FormGroup;
  surveyId: string = "";
  categories: SurveyCategory[];
  errors = [];
  _routeSubscription: Subscription;


  questionTypes: any[] = [
    { value: "boolean", viewValue: "YES / NO" },
    { value: "boolean", viewValue: "True / False" },
    { value: "mutiplechoice", viewValue: "Multiple Choice" },
    { value: "text", viewValue: "Single Answer" },
    { value: "paragraph", viewValue: "User Feedback" }
  ];

  @Input() survey: any;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get questions(): FormArray {
    return <FormArray>this.surveyForm.get('questions');
  }

  
  constructor(
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private _categoryService: SurveyCategoryService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'Survey name is required.',
        maxlength: 'Survey name cannot exceed 350 characters.'
      },
      category: {
        required: 'Survey Category is required.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.surveyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(350)]],
      category: ['', Validators.required],
      questions: this.fb.array([this.buildQuestion()])
    });


    this.loadCategories();

    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
    });
  }

  ngAfterViewInit()  {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.surveyForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800)).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.surveyForm);
      });
  }

  addQuestion(): void {
    this.questions.push(this.buildQuestion());
  }

  buildQuestion(): FormGroup {
    return this.fb.group({
      questionType: '',
      question: ['', Validators.required],
    });
  }


  onSurveyRetrieved(survey: Survey): void {
    if (this.surveyForm) {
      this.surveyForm.reset();
    }
    this.survey = survey;

    // Update the data on the form
    this.surveyForm.patchValue({
      name: this.survey.name,
      category: this.survey.category,
    });
    this.surveyForm.setControl('questions',
      this.fb.array((this.survey.questions || []).map((x) => this.fb.group(x))));
  }

  // ngOnChanges() {
  //   this.rebuildForm();
  // }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }
  

  getSurvey() {
    this._surveyService.getAsset(this.surveyId)
      .subscribe(
        (survey: Survey) => this.onSurveyRetrieved(survey),
        (error: any) => {
          if (error) {
            for (const key of Object.keys(error)) {
              const errors = error[key];
              this.errors.push(errors.message);
            }
          }
        }
      );
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

  // rebuildForm() {
  //   this.surveyForm.reset({
  //     name: this.survey.name,
  //     category: this.survey.category,
  //   });
  //   this.setQuestions(this.survey.questions);
  // }


  setQuestions(questions: Question[]) {
    const questionFGs = questions.map(question => this.fb.group(question));
    const questionFormArray = this.fb.array(questionFGs);
    this.surveyForm.setControl('questions', questionFormArray);
  }


  saveSurvey(): void {
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

}
export class Question {
  _id: any;
  _survey: any;
  questionType: string;
  qustion: string;
  options: any;
  answers: any;
  createdAt: any;
  updatedAt: any;
}