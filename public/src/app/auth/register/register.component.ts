import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../global/models/client';
import { states } from '../../global/models/states';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})

export class RegisterComponent implements OnInit {
  myForm: FormGroup;
  newClient: Client = new Client();
  errors = [];
  password_confirmation: string;
  currentClient: Client;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  states = states;

  private participant;

  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  businessName = new FormControl('');
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  confirm_pass = new FormControl('', Validators.required);
  phone = new FormControl('');
  address = new FormControl('', Validators.required);
  city = new FormControl('', Validators.required);
  state = new FormControl('', Validators.required);
  zip = new FormControl('', Validators.required);


  constructor(
    private _authService: AuthService, 
    private _router: Router,
    public snackBar: MatSnackBar,
    fb: FormBuilder
  ) {
    this.myForm = fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      businessName: this.businessName,
      email: this.email,
      password: this.password,
      confirm_pass: this.confirm_pass,
      phone: this.phone,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
    });
  }

  ngOnInit() {}


  addParticipant(form: any) {
    this.errors = [];

    this.participant = {
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'businessName': this.businessName.value,
      'email': this.email.value,
      'password': this.password.value,
      'confirm_pass': this.confirm_pass.value,
      'used': this.confirm_pass.value,
      'phone': this.phone.value,
      'address': this.address.value,
      'city': this.city.value,
      'state': this.state.value,
      'zip': this.zip.value,
    };

    this._authService.addParticipant(this.participant).subscribe((data: any) => {
      if (data.errors) {
        console.log("*** ERROR ***", data.errors)
        for (const key of Object.keys(data.errors)) {
          const error = data.errors[key];
          this.errors.push(error.message);
        }
      } else {
        console.log("___DATA RETURNED___:", data);
        this.errors = null;
        this.myForm.setValue({
          'firstName': null,
          'lastName': null,
          'businessName': null,
          'email': null,
          'password': null,
          'confirm_pass': null,
          'phone': null,
          'address': null,
          'city': null,
          'state': null,
          'zip': null,
        });
        this.openSnackBar();
        this._router.navigateByUrl("/login");
      }
    });
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("Thank you for registering", '', config);
  }
  
}
