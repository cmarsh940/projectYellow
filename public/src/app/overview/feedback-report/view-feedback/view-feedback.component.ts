import { Component, OnInit, Inject } from '@angular/core';
import { OverviewService } from 'app/overview/overview.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent {
  errors: any;

  constructor(
    private _overviewService: OverviewService,
    private dialogRef: MatDialogRef<ViewFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  markAsRead(id: any) {
    let data = {
      status: 'VIEWED'
    };
    this._overviewService.updateFeedback(id, data).subscribe((data: any) => {
      if (data) {
        console.log('updated client is:', data);
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          this.dialogRef.close();
        }
      }
    });
  }
  closeFeedback(id: any) {
    let data = {
      status: 'CLOSED'
    };
    this._overviewService.updateFeedback(id, data).subscribe((data: any) => {
      if (data) {
        console.log('updated client is:', data);
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          this.dialogRef.close();
        }
      }
    });
  }
  openFeedback(id: any) {
    let data = {
      status: 'OPENED'
    };
    this._overviewService.updateFeedback(id, data).subscribe((data: any) => {
      if (data) {
        console.log('updated client is:', data);
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          this.dialogRef.close();
        }
      }
    });
  }gOnInit() {
  }

}
