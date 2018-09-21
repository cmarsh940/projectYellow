import { Client } from './../../../global/models/client';
import { Component, Inject } from '@angular/core';
import { ClientService } from '../../client.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { states } from '../../../global/models/states';

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

  states = states;


  constructor(
    private _clientService: ClientService,
    private dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { };


  updateClient(): void {
    this.errors = [];
    this._clientService.updateParticipant(this.data._id, this.data).subscribe((data: any) => {
      if (data.errors) {
        console.log("*** ERROR ***", data.errors)
        for (const key of Object.keys(data.errors)) {
          const error = data.errors[key];
          this.errors.push(error.message);
        }
      } else {
      this.dialogRef.close();
    }
  });
}

  cancel(): void {
    this.dialogRef.close();
  }


}

