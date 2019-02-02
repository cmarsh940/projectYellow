import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { User } from '../../../global/models/user';
import { UserService } from '../user.service';



@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})

export class AddUserComponent implements OnInit {
  errors: string[] = [];
  newUser: User = new User();
  myForm: FormGroup;
  surveyId: string = "";

  private participant;

  nameFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  phoneFormControl = new FormControl('');

  constructor(
    private _userService: UserService,
    fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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

    console.log("Phone value is:", this.phoneFormControl.value);
    let phone = '';
    if (!this.phoneFormControl.value) {
      phone = this.phoneFormControl.value;
    } 
    else {
      phone = `+1${this.phoneFormControl.value}`;
    }

    this.participant = {
      'name': this.nameFormControl.value,
      'email': this.emailFormControl.value,
      'phone': phone,
      'surveyOwner': this.data.surveyOwner,
      '_survey': this.data.survey,
      'textSent': false,
      'answeredSurvey': false
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
          this.dialogRef.close();
          // this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }
      }
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
