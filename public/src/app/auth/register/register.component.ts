import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { states } from '../../models/states';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  newClient: Client = new Client();
  errors: string[] = [];
  password_confirmation: string;
  states = states;

  constructor(private _clientService: ClientService, private _router: Router) {}

  ngOnInit() {}

  createClient() {
    this.errors = [];
    return this._clientService.createClient(this.newClient, client => {
      if (client.errors) {
        for (let key in client.errors) {
          let errors = client.errors[key];
          this.errors.push(errors.message);
        }
      } else {
        this._clientService.setCurrentClient(client);
        this._router.navigate(["/dashboard"]);
      }
    });
  }
}
