import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-submit-survey-dialog',
  templateUrl: './submit-survey-dialog.component.html',
  styleUrls: ['./submit-survey-dialog.component.css']
})
export class SubmitSurveyDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<SubmitSurveyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  accept() {
    this.dialogRef.close(true);
  }

}
