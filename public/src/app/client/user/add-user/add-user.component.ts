import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

import { User } from '../../../global/models/user';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})

export class AddUserComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  newUser: User = new User();
  myForm: FormGroup;
  currentClient = JSON.parse(sessionStorage.getItem('currentClient'));
  matcher = new MyErrorStateMatcher();
  surveyId: string = "";
  _routeSubscription: Subscription;

  private participant;

  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  phoneFormControl = new FormControl('');

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private location: Location,
    fb: FormBuilder
  ) {
    this.myForm = fb.group({
      name: this.nameFormControl,
      email: this.emailFormControl,
      phone: this.phoneFormControl,
    }, { updateOn: 'blur' });
  }

  ngOnInit() { 
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];
      console.log("SURVEYS ID", this.surveyId);
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  addParticipant(form: any) {
    this.errors = [];

    console.log("Phone value is:", this.phoneFormControl.value);
    if (!this.phoneFormControl.value) {
      this.participant = {
        'name': this.nameFormControl.value,
        'email': this.emailFormControl.value,
        'phone': this.phoneFormControl.value,
        'surveyOwner': this.currentClient._id,
        '_survey': this.surveyId,
        'textSent': false,
        'answeredSurvey': false
      };

    } else {

      this.participant = {
        'name': this.nameFormControl.value,
        'email': this.emailFormControl.value,
        'phone': `+1${this.phoneFormControl.value}`,
        'surveyOwner': this.currentClient._id,
        '_survey': this.surveyId,
        'textSent': false,
        'answeredSurvey': false
      }
    }

    this._userService.addParticipant(this.participant).subscribe((data) => {
      if (data) {
        console.log("RETURNED DATA", data);
        if (data.errors) {
          console.log("___ DATA ERROR ___:", data.errors);
          this.errors.push(data.errors);
        } else {
          this.errors = null;
          this.myForm.setValue({
            'name': null,
            'email': null,
            'phone': null,
          });
          this.location.back();
          this._router.navigate(['../', { id: this.surveyId }], { relativeTo: this._activatedRoute });
        }
      }
    })
  }
}
