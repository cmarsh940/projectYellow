import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControlName, FormControl } from '@angular/forms';
import { GenericValidator } from '../../global/validators/generic-validator';
import { debounceTime } from 'rxjs/operators';

import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '../../global/models/survey';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Question } from '../../global/models/question';
import { questionGroups } from '../../global/models/question-group';
import { Platform } from '@angular/cdk/platform';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RegisterDialogComponent } from 'src/app/auth/register-dialog/register-dialog.component';


@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  surveyForm: FormGroup;
  surveyId: string = "";
  errors = [];
  _routeSubscription: Subscription;
  questionGroup = questionGroups;
  loaded: Boolean;
  currentPlatform: any;
  currentDevice: any;
  agent: any;

  other = 'Other';

  @Input() survey: any;

  // TIMER
  time: number = 0;
  interval;
  timeAverage: any;
  incentiveForm: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  weekdayFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  get questions(): FormArray {
    return <FormArray>this.surveyForm.get('questions');
  }

  private participant;

  userEmail = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog
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

    this.incentiveForm = fb.group({
      userEmail: this.userEmail,
    });
  }

  ngOnInit(): void {
    this.loaded = false;
    this.currentDevice = window.clientInformation.platform;
    this.currentPlatform = window.clientInformation.vendor;
    this.agent = window.clientInformation.userAgent;

    this.startTimer();
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
      answers: ['',  Validators.required],
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
          if (!survey) {
            this._router.navigate(["/404error"]);
          }
          if(survey.private){
            this._router.navigate(["/404error"]);
          }
          if(!survey.active){
            this._router.navigate(["/closed"]);
          }
          console.log("RETURNED SURVEY IS:", survey)
          for (let i = 0; i < survey.questions.length; i++) {
            survey.questions[i].answers = [];
          }
          console.log("SURVEY INCENTIVE:", survey.incentive);
          if (survey.incentive) {
            console.log("INCENTIVE STARTED")
            let incentiveQuestion = {
              userEmail: '',
              isRequired: false,
              question: 'Survey Complete',
              option: survey.incentive.name,
              questionType: "incentive" 
            }
            survey.questions.push(incentiveQuestion)
            console.log("NEW QUESTIONS W/ INCENTIVE:", survey.questions);
          } 
          console.log("SURVEY QUESTIONS:", survey.questions)
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

  prepareSaveSurvey() {
  // prepareSaveSurvey(): Survey {
    let tempTotal = this.survey.totalAnswers + 1;
    let allTime = this.survey.surveyTime + this.interval
    this.timeAverage = allTime / tempTotal;

    // CANCEL INTERVALS
    clearInterval(this.interval);
    
    const formModel = this.surveyForm.value;

    this.participant = {
      'email': this.userEmail.value,
    };
    console.log("PARTICIPANT IS:", this.participant);
    if(this.survey.incentive) {
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
    }, 1000)
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;


    const dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(`Dialog Error result:`);
        console.log(result);
      } else {
        console.log(`Dialog result:`);
        console.table(result);
        this._router.navigateByUrl("/login");
      }
    });
  }

}
