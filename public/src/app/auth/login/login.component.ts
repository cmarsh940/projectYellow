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

  loginParticipant(form: any) {
    this.errors = [];
    console.log("*** STARTING LOGIN ***")
    this.participant = {
      'email': this.email.value,
      'password': this.password.value,
      'used': this.password.value
    };

    this._authService.authenticate(this.participant).subscribe((data) => {
      console.log("___ LOGIN DATA RETURNED ___:", data);
      if(data) {
        if (data.errors) {
          console.log("___ LOGIN ERROR ___:", data.errors);
          this.errors.push(data.errors);
        } else {
          if (data.a8o1 !== "CLIENT") {
            this._authService.setCurrentClient(data);
            this._router.navigateByUrl("/overview");
          } else {
            this._authService.setCurrentClient(data); 
            this._router.navigateByUrl("/dashboard");
          }
        }
      } else {
        this.errors = data;
      }
    });
  }
}
