import { MetaService } from '@ngx-meta/core';
import { Component, OnInit, OnDestroy, Input, ViewChildren, ElementRef, Inject, PLATFORM_ID, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControlName, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { questionGroups, Question } from '@shared/models/question-group';
import { SurveyService } from 'app/client/survey/survey.service';
import { Survey } from '@shared/models/survey';
import { GenericValidator } from '@shared/validators/generic-validator';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material';
import { SubmitSurveyDialogComponent } from '../submit-survey-dialog/submit-survey-dialog.component';
import { takeUntil } from 'rxjs/operators';

/**
TODO:
  - [] fix options not returning to array
*/
@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  surveyForm: FormGroup;
  surveyId: string = '';
  errors = [];
  private unsubscribe$ = new Subject();
  questionGroup = questionGroups;
  loaded: Boolean;
  currentPlatform: any;
  currentDevice: any;
  agent: any;

  other = 'Other';
  userOther: any;
  checked: boolean;

  @Input() survey: any;

  // TIMER
  time: number = 0;
  interval;
  timeAverage: any;
  incentiveForm: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  private participant;

  userEmail = new FormControl('');
  private genericValidator: GenericValidator;

  weekdayFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  get questions(): FormArray {
    return <FormArray>this.surveyForm.get('questions');
  }

  constructor(
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private readonly meta: MetaService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.checked = false;

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

    this.incentiveForm = fb.group({
      userEmail: this.userEmail,
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loaded = false;
      this.currentDevice = window.clientInformation.platform;
      this.currentPlatform = window.clientInformation.vendor;
      this.agent = window.clientInformation.userAgent;

      this.startTimer();
      this.surveyForm = this.fb.group({
        questions: this.fb.array([this.buildQuestion()])
      });

      this._activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
        this.surveyId = params['id'];
        console.log('id is:', this.surveyId);
        this.getSurvey();
      });

      setTimeout(() => {
        this.loaded = true;
      }, 1000);
    }
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  addQuestion(): void {
    this.questions.push(this.buildQuestion());
  }


  buildQuestion(): FormGroup {
    return this.fb.group({
      answers: ['',  Validators.required],
      isRequired: [''],
      question: ['', { disabled: true, value: null }, Validators.required],
      options: this.fb.array([]),
    });
  }


  ngOnDestroy() {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }


  getSurvey() {
    this._surveyService.getAsset(this.surveyId)
      .pipe(takeUntil(this.unsubscribe$)).subscribe(
        (survey: Survey) => {
          if (!survey) {
            this._router.navigate(['/404error']);
          }
          if (survey.private) {
            this._router.navigate(['/404error']);
          }
          if (!survey.active) {
            this._router.navigate(['/survey-closed']);
          }
          console.log('RETURNED SURVEY IS:', survey);
          this.meta.setTag('og:title', survey.name);
          this.meta.setTag('twitter:title', survey.name);
          this.meta.setTag('og:description', 'Take our survey!');
          // this.meta.setTag('og:url', `https://surveysbyme.com/takeSurvey/${this.survey._id}`);
          for (let i = 0; i < survey.questions.length; i++) {
            survey.questions[i].answers = [];
          }
          console.log('SURVEY INCENTIVE:', survey.incentive);
          if (survey.incentive) {
            console.log('INCENTIVE STARTED');
            const incentiveQuestion = {
              userEmail: '',
              isRequired: false,
              question: 'Survey Complete',
              option: survey.incentive.name,
              questionType: 'incentive'
            };
            survey.questions.push(incentiveQuestion);
            console.log('NEW QUESTIONS W/ INCENTIVE:', survey.questions);
          }
          console.log('SURVEY QUESTIONS:', survey.questions);
          this.onSurveyRetrieved(survey);
        },
        (error: any) => {
          if (error) {
            for (const key of Object.keys(error)) {
              const errors = error[key];
              this.errors = errors.message;
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
        this.submittedDialog();
      },
      error => {
        console.log('___ERROR___:', error);
        for (const key of Object.keys(error)) {
          const errors = error[key];
          this.errors = errors.message;
        }
      });
  }

  prepareSaveSurvey() {
  // prepareSaveSurvey(): Survey {
    const tempTotal = this.survey.totalAnswers + 1;
    const allTime = this.survey.surveyTime + this.interval;
    this.timeAverage = allTime / tempTotal;

    // CANCEL INTERVALS
    clearInterval(this.interval);

    const formModel = this.surveyForm.value;

    this.participant = {
      'email': this.userEmail.value,
    };
    console.log('PARTICIPANT IS:', this.participant);
    if (this.survey.incentive) {
      formModel.questions.pop();
    }
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
      user: this.participant,
      averageTime: this.timeAverage,
      surveyTime: allTime,
      totalAnswers: this.survey.totalAnswers + 1,
      creator: this.survey.creator,
      device: this.currentDevice,
      agent: this.agent,
      active: this.survey.active,
      platform: this.currentPlatform,
      incentive: this.survey.incentive,
      createdAt: this.survey.createdAt,
      updatedAt: this.survey.updatedAt
    };
    return saveSurvey;
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.time++;
    }, 1000);
  }

  OnChange($event) {
    console.log($event);
    this.userOther = $event.target.value;
  }

  submittedDialog() {
    const dialogRef = this.dialog.open(SubmitSurveyDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this._router.navigate(['/survey-list']);
    });
  }
}
