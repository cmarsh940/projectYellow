import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';


import { SurveyService } from '../survey.service';
import { Client } from '@shared/models/client';
import { Survey } from '@shared/models/survey';

import { ProfileService } from 'app/client/profile/profile.service';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { AuthService } from 'app/auth/auth.service';
import { WarnDialogComponent } from 'app/client/warn-dialog/warn-dialog.component';

/**
TODO:
  - [] add ability to post survey to facebook
*/
@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit, AfterContentChecked {
  currentClient: Client;
  remaining: number;
  pc: boolean;
  errorMessage;
  id = this.universalStorage.getItem('t940');
  dialogResult: any;

  // PAGINATE
  dataSource: any;
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  legth = 0;
  pageEvent;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created', 'name', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private universalStorage: UniversalStorage,
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _surveyService: SurveyService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getSurveys();
    this.check();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  check() {
    this.pc = false;
    return this._authService.check(this.id).then(data => {
        if (data.b8o1 !== 'FREE') {
          console.log('Subscribed');
          this.pc = true;
        } else {
          console.log('Trial');
          this.pc = false;
        }
    });
  }

  getSurveys() {
    this._profileService.getparticipant(this.id)
      .subscribe((response) => {
        this.remaining = response.surveyCount;
        this.dataSource = new MatTableDataSource<Element>(response._surveys);
        this.dataSource.paginator = this.paginator;
        this.array = response._surveys;
        if (!this.array) {
          this.totalSize = 0;
        } else {
          this.totalSize = this.array.length;
        }
        this.iterator();
      });
  }

  closeSurvey(id: string) {
    const dialogRef = this.dialog.open(WarnDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('result is:', result);
      if (result) {
        this._surveyService.closeAsset(id).subscribe(res => {
          if (res) {
            this.getSurveys();
            location.reload();
          }
        });
      }
      if (!result) {
        console.log('Survey not closed');
      }
    });
  }

  openSurvey(id: string) {
    const dialogRef = this.dialog.open(WarnDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('result is:', result);
      if (result) {
        this._surveyService.openAsset(id).subscribe(res => {
          if (res) {
            this.getSurveys();
            location.reload();
          }
        });
      }
      if (!result) {
        console.log('Survey not opened');
      }
    });
  }

  destroySurvey(id: string) {
    const dialogRef = this.dialog.open(WarnDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('result is:', result);
      if (result) {
        this._surveyService.deleteAsset(id).subscribe(res => {
          if (res) {
            this.getSurveys();
            location.reload();
          }
        });
      }
      if (!result) {
        console.log('Survey not deleted');
      }
    });
  }

  download(): void {
  }

  TrackById(index: number, survey: Survey) {
    return survey._id;
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    if (this.array) {
      const end = (this.currentPage + 1) * this.pageSize;
      const start = this.currentPage * this.pageSize;
      const part = this.array.slice(start, end);
      this.dataSource = part;
    }
  }

}
