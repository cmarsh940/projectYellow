import { AuthService } from './../auth.service';
import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Client } from "../../global/models/client";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentClient: Client = new Client();
  errors: string[] = [];
  hide = true;
  email = new FormControl("", [Validators.required, Validators.email]);
  client: Client;

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email") ? "Not a valid email" : "";
  }

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit() { }

  loginClient() {
    console.log("*** STARTING LOGIN ***")
    let tempUsed = "";
    this.errors = [];
    tempUsed = this.currentClient.password;
    this.currentClient.used = tempUsed;
    this._authService.authenticate(this.currentClient).subscribe((data: any) => {
      if (data.errors) {
        console.log("*** ERROR ***", data.errors)
        for (const key of Object.keys(data.errors)) {
          const error = data.errors[key];
          this.errors.push(error.message);
        }
      }
      console.log("___DATA RETURNED___:", data);
      this._authService.setCurrentClient(data);
      if (data.role === 'CAPTAIN') {
          this._router.navigateByUrl("/overview");
        }
        this._router.navigateByUrl("/dashboard");
    });
  }
}
