import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentUser: User = new User();
  errors: string[] = [];
  hide = true;
  // newUser: User = new User();
  email = new FormControl("", [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email") ? "Not a valid email" : "";
  }

  constructor(private _userService: UserService, private _router: Router) { }

  ngOnInit() { }

  loginUser() {
    this.errors = [];
    this._userService.authenticate(this.currentUser, user => {
      if (user.errors) {
        for (const key of Object.keys(user.errors)) {
          const error = user.errors[key];
          this.errors.push(error.message);
        }
      } else {
        this._userService.setCurrentUser(user);
        this._router.navigateByUrl("/dashboard");
      }
    });
  }

}
