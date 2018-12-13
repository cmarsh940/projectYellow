import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { forbiddenNameValidator } from 'src/app/global/validators/forbidden-name.directive';
import { ErrorStateMatcher } from '@angular/material';

import { User } from '../../../global/models/user';
import { UserService } from '../user.service';


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
export class AddUserComponent implements OnInit {
  errors: string[] = [];
  newUser: User = new User();
  myForm: FormGroup;
  currentClient = JSON.parse(sessionStorage.getItem('currentClient'));
  matcher = new MyErrorStateMatcher();

  private participant;

  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  phoneFormControl = new FormControl('', [
    Validators.pattern('[0-9]*'),
    Validators.minLength(10),
    Validators.maxLength(14),
  ]);

  constructor(
    private _userService: UserService,
    private _router: Router,
    fb: FormBuilder
  ) {
    this.myForm = fb.group({
      name: this.nameFormControl,
      email: this.emailFormControl,
      phone: this.phoneFormControl,
    }, { updateOn: 'blur' });
  }

  ngOnInit() { }


  addParticipant(form: any) {
    this.errors = [];

    this.participant = {
      'name': this.nameFormControl.value,
      'email': this.emailFormControl.value,
      'phone': `+1${this.phoneFormControl.value}`,
      'surveyOwner': this.currentClient._id
    };

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
          // this._router.navigateByUrl("/login");
        }
      }
    })
  }
}
