import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { Client } from './../../global/models/client';
import { MatDialog } from '@angular/material';
import { EditClientComponent } from './edit-client/edit-client.component';
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
    private _authService: AuthService,
    private _profileService: ProfileService,
    public dialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getUserInformation();
  }


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
    let id = JSON.parse(sessionStorage.getItem('currentClient'));
    this._profileService.getparticipant(id)
      .subscribe(res => {
        console.log("User", res);
        this.currentUser = res
      });
  }
}
