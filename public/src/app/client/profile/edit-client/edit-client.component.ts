import { Client } from './../../../global/models/client';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ClientService } from '../../client.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnDestroy {
  client = new Client();
  subscription: Subscription;
  clientId: string = "";
  errors = [];


  constructor(
    public _clientService: ClientService, 
    public dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getClient() {
    this._clientService.getparticipant(this.clientId)
      .subscribe(res => {
        console.log("Client", res);
        this.client = res
      });
  }

  updateClient(): void {
    this.errors = [];
    this._clientService.updateParticipant(this.client, res => {
      if (res.errors) {
        for (const key of Object.keys(res.errors)) {
          const errors = res.errors[key];
          this.errors.push(errors.message);
        }
      } 
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  
}
