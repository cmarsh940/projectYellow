import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { RegisterDialogComponent } from 'src/app/auth/register-dialog/register-dialog.component';

@Component({
  selector: 'app-survey-closed',
  templateUrl: './survey-closed.component.html',
  styleUrls: ['./survey-closed.component.css']
})
export class SurveyClosedComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.maxWidth = '22em'


    const dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(`Dialog Error result:`);
        console.log(result);
      } else {
        console.log(`Dialog result:`);
        console.table(result);
        this._router.navigateByUrl("/login");
      }
    });
  }

}
