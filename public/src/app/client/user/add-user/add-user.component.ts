import { Component, OnInit } from '@angular/core';
import { states } from '../../../models/states';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})
export class AddUserComponent implements OnInit {
  newUser: User = new User();
  errors: string[] = [];
  password_confirmation: string;
  states = states;

  constructor(private _userService: UserService, private _router: Router) {}

  ngOnInit() {}

  createUser() {
    this.errors = [];
    return this._userService.createUser(this.newUser, user => {
      if (user.errors) {
        for (let key in user.errors) {
          let errors = user.errors[key];
          this.errors.push(errors.message);
        }
      } else {
        this._userService.setCurrentUser(user);
        this._router.navigate(["/dashboard"]);
      }
    });
  }
}
