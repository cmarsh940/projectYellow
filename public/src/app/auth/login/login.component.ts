import { AuthService } from './../auth.service';
import { FormControl, Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Client } from "../../global/models/client";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errors: string[] = [];
  client: Client;
  myForm: FormGroup;
  currentClient: Client;
  errorMessage;

  hide = true;

  private participant;


  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);


  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email") ? "Not a valid email" : "";
  }

  constructor(private _authService: AuthService, private _router: Router, fb: FormBuilder
  ) {
    this.myForm = fb.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit() { }

  loginParticipant(form: any): Promise<any> {
    this.participant = {
      'email': this.email.value,
      'password': this.password.value,
      'used': this.password.value
    };

    this.myForm.setValue({
      'email': null,
      'password': null
    });

    return this._authService.authenticate(this.participant)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.myForm.setValue({
          'email': null,
          'password': null
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
  // loginClient() {
  //   console.log("*** STARTING LOGIN ***")
  //   let tempUsed = "";
  //   this.errors = [];
  //   tempUsed = this.currentClient.password;
  //   this.currentClient.used = tempUsed;
  //   this._authService.authenticate(this.currentClient).subscribe((data: any) => {
  //     if (data.errors) {
  //       console.log("*** ERROR ***", data.errors)
  //       for (const key of Object.keys(data.errors)) {
  //         const error = data.errors[key];
  //         this.errors.push(error.message);
  //       }
  //     }
  //     console.log("___DATA RETURNED___:", data);
  //     this._authService.setCurrentClient(data);
  //     if (data.role === 'CAPTAIN') {
  //         this._router.navigateByUrl("/overview");
  //       }
  //       this._router.navigateByUrl("/dashboard");
  //   });
  // }
}
