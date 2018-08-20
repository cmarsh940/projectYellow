import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../auth/auth.service';
import { Client } from '../../global/models/client';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  currentUser: Client;
  cards = [
    { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Card 2', cols: 2, rows: 1 },
    { title: 'Card 3', cols: 2, rows: 1 },
    { title: 'Card 4', cols: 2, rows: 1 }
  ];

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() { }
}
