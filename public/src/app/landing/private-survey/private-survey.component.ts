import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, Input } from '@angular/core';
import { FormControlName, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { questionGroups } from 'src/app/global/models/question-group';
import { GenericValidator } from 'src/app/global/validators/generic-validator';
import { SurveyService } from 'src/app/client/survey/survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Survey } from 'src/app/global/models/survey';
import { Question } from 'src/app/global/models/question';

@Component({
  selector: 'app-private-survey',
  templateUrl: './private-survey.component.html',
  styleUrls: ['./private-survey.component.css']
})
export class PrivateSurveyComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  surveyForm: FormGroup;
  surveyId: string = "";
  errors = [];
  _routeSubscription: Subscription;
  questionGroup = questionGroups;
  loaded: Boolean;

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
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      answers: {
        required: 'A answer is required.'
      },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.loaded = false;
    this.surveyForm = this.fb.group({
      questions: this.fb.array([this.buildQuestion()])
    });

    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
    });

    setTimeout(() => {
      this.loaded = true;
    }, 1000);
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

  addQuestion(): void {
    this.questions.push(this.buildQuestion());
  }


  buildQuestion(): FormGroup {
    return this.fb.group({
      answers: ['', Validators.required],
      isRequired: [''],
      question: ['', { disabled: true }, Validators.required],
      options: this.fb.array([])
    });
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
          this.onSurveyRetrieved(survey)
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

  onSurveyRetrieved(survey: Survey): void {
    if (this.surveyForm) {
      this.surveyForm.reset();
    }
    this.survey = survey;

    // Update the data on the form
    this.surveyForm.patchValue({});
    this.surveyForm.setControl('questions',
      this.fb.array((this.survey.questions || []).map((x) => this.fb.group(x))));
  }

  rebuildForm() {
    this.surveyForm.reset();
    this.setQuestions(this.survey.questions);
  }


  setQuestions(questions: Question[]) {
    const questionFGs = questions.map(question => this.fb.group(question));
    const questionFormArray = this.fb.array(questionFGs);
    this.surveyForm.setControl('questions', questionFormArray);
  }


  submitForm(): void {
    this.errors = [];
    this.survey = this.prepareSaveSurvey();
    this._surveyService.updateAnswer(this.survey._id, this.survey).subscribe(
      result => {
        alert("Thank you for taking our survey!");
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
      category: this.survey.category,
      submissionDates: this.survey.submissionDates,
      lastSubmission: Date.now(),
      name: this.survey.name,
      private: this.survey.private,
      questions: questionsDeepCopy,
      user: this.survey.user,
      creator: this.survey.creator,
      createdAt: this.survey.createdAt,
      updatedAt: this.survey.updatedAt
    };
    return saveSurvey;
  }

}