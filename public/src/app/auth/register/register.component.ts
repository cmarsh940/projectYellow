import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../global/models/client';


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  newClient: Client = new Client();
  errors: string[] = [];
  password_confirmation: string;

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  createClient() {
    this.errors = [];
    return this._authService.createClient(this.newClient, client => {
      if (client.errors) {
        for (let key in client.errors) {
          let errors = client.errors[key];
          this.errors.push(errors.message);
        }
      } else {
        this._authService.setCurrentClient(client);
        this._router.navigate(["/dashboard"]);
      }
    });
  }
}
