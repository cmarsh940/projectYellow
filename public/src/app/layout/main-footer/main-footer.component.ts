import { RightsComponent } from './../../landing/rights/rights.component';
import { Component } from '@angular/core';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent {

  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(RightsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openFeedback() {
    const feedbackRef = this.dialog.open(FeedbackComponent);

    feedbackRef.afterClosed().subscribe(result => {
      console.log(`Feedback result: ${result}`);
    });
  }
}
