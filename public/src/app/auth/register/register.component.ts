import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../global/models/client';
import { states } from '../../global/models/states';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  myForm: FormGroup;
  newClient: Client = new Client();
  errors: string[] = [];
  password_confirmation: string;
  currentClient: Client;
  errorMessage;

  states = states;

  private participant;

  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  businessName = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
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
    fb: FormBuilder
  ) {
    this.myForm = fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      businessName: this.lastName,
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

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'businessName': this.lastName.value,
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
      'zip': null
    });

    return this._authService.addParticipant(this.participant)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
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
          'zip': null
        });
        this._router.navigateByUrl("/dashboard");
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          this.errorMessage = error;
        }
      });
  }
  // createClient() {
  //   let tempUsed = "";
  //   this.errors = [];
  //   tempUsed = this.newClient.password;
  //   this.newClient.used = tempUsed;
  //   return this._authService.createClient(this.newClient).subscribe(client => {
  //     this.currentClient = client;
  //     console.log(this.currentClient);
  //     this._router.navigate(["/dashboard"]);
  //   });
        
  // }
}
