import { Component, OnInit } from '@angular/core';
import { User } from '../../../global/models/user';

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"]
})
export class AddUserComponent implements OnInit {
  newUser: User = new User();

  constructor() {

  };

  ngOnInit(): void {
  }

  createUser() {
    console.log("createUser");
  }

  
}
