import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChildren, ElementRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControlName } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SurveyService } from '../survey.service';
import { SurveyCategory } from '@shared/models/survey-category';
import { questionGroups, Question } from '@shared/models/question-group';
import { Survey } from '@shared/models/survey';
import { AuthService } from 'app/auth/auth.service';
import { GenericValidator } from '@shared/validators/generic-validator';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { SurveyCategoryService } from 'app/overview/survey-category-report/survey-category.service';


/**
TODO:
  - [x] fix options not displaying
*/

@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css']
})


export class EditSurveyComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  surveyForm: FormGroup;
  surveyId: string = '';
  errors = [];
  _routeSubscription: Subscription;
  categories: SurveyCategory[];
  clientId: any;
  pc: boolean;

  questionGroups = questionGroups;

  @Input() survey: any;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get questions() {
    return (<FormArray>this.surveyForm.get('questions')).controls;
  }

  getOptionsFor(index) {
    return (<FormArray>(<FormArray>this.surveyForm.get('questions')).controls[index].get('options')).controls;
  }


  constructor(
    private universalStorage: UniversalStorage,
    private fb: FormBuilder,
    private _authService: AuthService,
    private _categoryService: SurveyCategoryService,
    private _surveyService: SurveyService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'Survey name is required.'
      },
      question: {
        required: 'A question is required.'
      },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.clientId = this.universalStorage.getItem('t940');
    this.surveyForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      private: [''],
      public: [''],
      experationDate: [''],
      questions: this.fb.array([this.initQuestion()])
    });

    this.loadCategories();

    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
      this.check();
    });
  }

  ngAfterViewInit() {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.surveyForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800)).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.surveyForm);
      });
  }

  check() {
    this.pc = false;
    return this._authService.check(this.clientId).then(data => {
      if (data.b8o1 !== 'FREE') {
        console.log('Subscribed');
        this.pc = true;
      } else {
        console.log('Trial');
        this.pc = false;
      }
    });
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
      isRequired: false,
      optionName: [''],
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
      private: this.survey.private,
      public: this.survey.public
    });
    this.surveyForm.setControl('questions',
      this.fb.array((this.survey.questions || []).map(question => this.fb.group({
        id: question._id,
        question: question.question,
        isRequired: question.isRequired,
        questionType: question.questionType,
        options: this.fb.array(this.getOptions(question.options) || []),
      }))));
  }
  getOptions(options: any[]) {
    return options.map(option => this.fb.group({
      optionName: option.optionName,
    }));
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }


  getSurvey() {
    this._surveyService.getAsset(this.surveyId)
      .subscribe(
        (survey: Survey) => {
          for (let i = 0; i < survey.questions.length; i++) {
            survey.questions[i].answers = [];
          }
          this.onSurveyRetrieved(survey);
        },
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

  rebuildForm() {
    this.surveyForm.reset();
    // this.setQuestions(this.survey.questions);
  }

  // setQuestions(questions: Question[]) {
  //   const questionFGs = questions.map(question => this.fb.group(question));
  //   const questionFormArray = this.fb.array(questionFGs);
  //   this.surveyForm.setControl('questions', questionFormArray);
  // }

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

  // PREPARE SURVEY FORM FOR SUBMITTING
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
      submissionDates: this.survey.submissionDates,
      lastSubmission: this.survey.lastSubmission,
      private: formModel.private,
      public: formModel.public,
      questions: questionsDeepCopy,
      user: this.survey.user,
      creator: this.survey.creator,
      createdAt: this.survey.createdAt,
      updatedAt: Date.now()
    };
    return saveSurvey;
  }

  // SUBMIT FORM TO DATABASE
  submitForm(): void {
    this.errors = [];
    this.survey = this.prepareSaveSurvey();
    console.log('$$$ after saved survey:', this.survey);
    this._surveyService.updateAsset(this.survey._id, this.survey).subscribe(
      result => {
        this._router.navigate(['/dashboard/survey']);
      },
      error => {
        console.log('___ERROR___:', error);
        for (const key of Object.keys(error)) {
          const errors = error[key];
          this.errors.push(errors.message);
        }
      });
    if (!this.errors) {
      this._router.navigate(['/dashboard/survey']);
    }
  }
}
