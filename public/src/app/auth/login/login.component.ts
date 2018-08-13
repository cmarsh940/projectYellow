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

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email") ? "Not a valid email" : "";
  }

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit() { }

  loginClient() {
    console.log("*** STARTING LOGIN ***")
    this.errors = [];
    this._authService.authenticate(this.currentClient, client => {
      if (client.errors) {
        console.log("*** ERROR ***", client.errors)
        for (const key of Object.keys(client.errors)) {
          const error = client.errors[key];
          this.errors.push(error.message);
        }
      } else {
        console.log("*** LOGING IN ***")
        this._authService.setCurrentClient(client);
        this._router.navigateByUrl("/dashboard");
      }
    });
  }
}
