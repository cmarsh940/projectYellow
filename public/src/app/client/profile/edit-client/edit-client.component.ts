import { Client } from './../../../global/models/client';
import { Component, Inject } from '@angular/core';
import { ClientService } from '../../client.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})

export class EditClientComponent {
  client = new Client();
  subscription: Subscription;
  clientId: string = "";
  errors = [];


  constructor(
    private _clientService: ClientService,
    private dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { };


  updateClient(): void {
    this.errors = [];
    this._clientService.updateParticipant(this.data, res => {
      if (res.errors) {
        for (const key of Object.keys(res.errors)) {
          const errors = res.errors[key];
          this.errors.push(errors.message);
        }
      }
      this.dialogRef.close();
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }


}

