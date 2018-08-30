import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../global/models/client';
import { states } from '../../global/models/states';


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  newClient: Client = new Client();
  errors: string[] = [];
  password_confirmation: string;
  currentClient: Client;

  states = states;

  constructor(
    private _authService: AuthService, 
    private _router: Router
  ) {}

  ngOnInit() {}

  createClient() {
    this.errors = [];
    return this._authService.createClient(this.newClient).subscribe(client => {
      this.currentClient = client;
      console.log(this.currentClient);
      this._router.navigate(["/dashboard"]);
    });
        
  }
}
