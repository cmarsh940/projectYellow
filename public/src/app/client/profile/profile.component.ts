import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Client } from './../../global/models/client';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: Client = null;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn() {
    if (this._authService.getCurrentClient() == null) {
      this._router.navigateByUrl('/login');
    }
  }

}
