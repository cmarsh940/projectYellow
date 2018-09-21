import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
  currentClient= new Client();
  clientId = '';
  _routeSubscription: Subscription;
  id: String;
  errors = [];

  constructor(
    public dialog: MatDialog,
    private _profileService: ProfileService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.clientId = params['id'];
      this.getClient();
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(EditClientComponent, {
      data: this.currentClient,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  getClient() {
    this._profileService.getparticipant(this.clientId)
      .subscribe(
        (client: Client) => {
          this.currentClient = client;
        },
        (error: any) => {
          if (error) {
            for (const key of Object.keys(error)) {
              const errors = error[key];
              this.errors.push(errors.message);
            }
          }
        }
      );
    }
}
