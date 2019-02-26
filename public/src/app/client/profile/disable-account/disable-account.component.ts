import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { Client } from '@shared/models/client';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-disable-account',
  templateUrl: './disable-account.component.html',
  styleUrls: ['./disable-account.component.css']
})
export class DisableAccountComponent {

  constructor(
    private _profileService: ProfileService,
    private dialogRef: MatDialogRef<DisableAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { }

  cancelSubscription(id: string) {
    this._profileService.cancelSubscription(id).subscribe(res => {
      if (!res) {
        alert('ERROR CANCELING SUBSCRIPTION');
      } else {
        console.log('SUBSCRIPTION CANCELED');
        this.dialogRef.close(true);
      }
    });
  }
}
