import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RightsComponent } from '../rights/rights.component';

@Component({
  selector: 'app-subscription-error',
  templateUrl: './subscription-error.component.html',
  styleUrls: ['./subscription-error.component.css']
})
export class SubscriptionErrorComponent {

  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(RightsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
