import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Client } from 'src/app/global/models/client';

@Component({
  selector: 'app-subscription-overlay',
  templateUrl: './subscription-overlay.component.html',
  styleUrls: ['./subscription-overlay.component.css']
})
export class SubscriptionOverlayComponent {

  constructor(
    private dialogRef: MatDialogRef<SubscriptionOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { }


  click(){
    this.dialogRef.close();
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
}
