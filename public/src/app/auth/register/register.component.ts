import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  currentUser: User = new User();
  newUser: User = new User();
  users: Array<User> = []
  errors: string[] = [];
  password_confirmation: string;


  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    // this.isLoggedIn();
    // this.validateSession();
    // this.getUsers();
  }

  isLoggedIn() {
    if (this._userService.getCurrentUser() == null) {
      this._router.navigateByUrl('/');
    }
  }

  validateSession(): void {
    if (!this.currentUser) {
      this._router.navigateByUrl('/');
    }
  }

  getUsers(): void {
    this._userService.getUsers((users) => this.users = users);
  }

  createUser() {
    this.errors = [];
    return this._userService.createUser(this.newUser, (user) => {
      if (user.errors) {
        for (let key in user.errors) {
          let errors = user.errors[key];
          this.errors.push(errors.message);
        }
      } else {
        this._userService.setCurrentUser(user);
        this.getUsers();
        this._router.navigate(['/dashboard']);
      }
    })
  }
s
  destroyUser(id: string, idx: any) {
    this._userService.destroy(id, res => this.users.splice(idx, 1));
  }

}
