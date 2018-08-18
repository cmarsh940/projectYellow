import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { Client } from './../../global/models/client';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser= new Client();
  subscription: Subscription;
  id: String;

  constructor(
    private _profileService: ProfileService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn();
    this.getUserInformation();
  }

  isLoggedIn() {
    if (this._authService.getCurrentClient() == null) {
      this._router.navigateByUrl('/login');
    }
  }

  getUserInformation() {
    this.currentUser = JSON.parse(localStorage.getItem('currentClient'));
  }
}
