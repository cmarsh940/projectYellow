import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { Client } from './../../global/models/client';
import { ProfileService } from './profile.service';
import { MatDialog } from '@angular/material';
import { EditClientComponent } from './edit-client/edit-client.component';

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
    public dialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn();
    this.getUserInformation();
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  openDialog() {
    const dialogRef = this.dialog.open(EditClientComponent, {
      data: this.currentUser,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
