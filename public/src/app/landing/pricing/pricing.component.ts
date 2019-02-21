import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { RegisterDialogComponent } from 'app/auth/register-dialog/register-dialog.component';
import { FeedbackComponent } from '@shared/feedback/feedback.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  contactEmail = 'mailto:surveysbyme@mellcgroup.com';

  constructor(
    public dialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  feedbackDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.maxWidth = '22em';


    const dialogRef = this.dialog.open(FeedbackComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(`Dialog Error result:`);
        console.log(result);
      } else {
        console.log(`Dialog result:`);
        console.table(result);
        this._router.navigateByUrl('/login');
      }
    });
  }

  registerDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.maxWidth = '22em';


    const dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(`Dialog Error result:`);
        console.log(result);
      } else {
        console.log(`Dialog result:`);
        console.table(result);
        this._router.navigateByUrl('/login');
      }
    });
  }

}
