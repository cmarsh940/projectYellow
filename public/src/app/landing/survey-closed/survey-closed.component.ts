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

  constructor() { }

  ngOnInit() {
  }

}
