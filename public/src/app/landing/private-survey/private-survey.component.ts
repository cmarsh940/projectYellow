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
  userId: String;
  currentPlatform: any;
  currentDevice: any;
  agent: any;

  @Input() survey: any;

  // TIMER
  time: number = 0;
  interval;
  timeAverage: any;

  assigned: Boolean;

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

    // SET META INFO
    this.currentDevice = window.clientInformation.platform;
    this.currentPlatform = window.clientInformation.vendor;
    this.agent = window.clientInformation.userAgent;

    this.surveyForm = this.fb.group({
      questions: this.fb.array([this.buildQuestion()])
    });

    this.userId = this._activatedRoute.snapshot.url[1].path;

    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      this.getSurvey();
    });

    setTimeout(() => {
      this.loaded = true;
      this.startTimer();
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
          this.assigned = false;

          // CHECK IF SURVEY IS PRIVATE
          if(survey.private) {

            // SET ANSWERS TO EMPTY []
            for (let i = 0; i < survey.questions.length; i++) {
              survey.questions[i].answers = [];
            }
            this.assigned = false;

            // CHECK IF USER IS ASSIGNED TO SURVEY
            let tempArray = survey.users;

            tempArray.forEach(user => {
              if(user === this.userId) {
                // IF USER IS IN THE LIST ASSIGN VALUE TO TRUE
                this.assigned = true;
              }
            });

            // IF ASSIGNED THEN START TO DISPLAY SURVEY
            if (this.assigned) {
              this.onSurveyRetrieved(survey)
            } else {

              // IF NOT ASSIGNED THEN REDIRECT TO SURVEY ERROR
              console.warn("ERROR USER NOT ASSIGENED TO SURVEY");
              this._router.navigate(["/surveyError"]);
            }
          } else {

            // IF SURVEY NOT PRIVATE REDIRECT TO SURVEY ERROR
            console.warn("ERROR SURVEY IS NOT PRIVATE");
            this._router.navigate(["/surveyError"]);
          }
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
    this._surveyService.updatePrivateAnswer(this.survey._id, this.survey).subscribe(
      result => {
        console.log("Thank you for taking our survey!");
        this._router.navigate(["/success"]);
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
    let tempTotal = this.survey.totalAnswers + 1;
    let allTime = this.survey.surveyTime + this.interval
    this.timeAverage = allTime / tempTotal;

    // CANCEL INTERVALS
    clearInterval(this.interval);

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
      user: this.userId,
      averageTime: this.timeAverage,
      surveyTime: allTime,
      totalAnswers: this.survey.totalAnswers + 1,
      creator: this.survey.creator,
      device: this.currentDevice,
      agent: this.agent,
      platform: this.currentPlatform,
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

}