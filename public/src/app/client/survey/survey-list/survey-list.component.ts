import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';


import { SurveyService } from '../survey.service';
import { Client } from '@shared/models/client';
import { Survey } from '@shared/models/survey';

// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit, AfterContentChecked {
  currentClient: Client;
  remaining: number;
  errorMessage;

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
    // private _profileService: ProfileService,
    private _surveyService: SurveyService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getSurveys();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getSurveys() {
    // let surveyOwner = JSON.parse(sessionStorage.getItem('currentClient'));
    // let id = surveyOwner._id;
    // this._profileService.getparticipant(id)
    //   .subscribe((response) => {
    //     this.remaining = response.surveyCount;
    //     this.dataSource = new MatTableDataSource<Element>(response._surveys);
    //     this.dataSource.paginator = this.paginator;
    //     this.array = response._surveys;
    //     if(!this.array){
    //       this.totalSize = 0;
    //     }
    //     else {
    //       this.totalSize = this.array.length;
    //     }
    //     this.iterator();
    //   });
  }

  closeSurvey(id: string) {
    // let r = window.confirm("Close Survey?");
    // if (r == true) {
    //   this._surveyService.closeAsset(id).subscribe(res => {
    //     console.log("CLOSED SURVEY");
    //     if(!res){
    //       window.close();
    //     }
    //     if (true) {
    //       this.getSurveys();
    //       location.reload();
    //     }
    //   });
    // } else {
    //   window.close();
    // }
  }

  openSurvey(id: string) {
    // let r = window.confirm("Open Survey?");
    // if (r == true) {
    //   return this._surveyService.openAsset(id).subscribe(res => {
    //     if(!res){
    //       window.close();
    //     }
    //     if (true) {
    //       console.log("SURVEY OPENED");
    //       this.getSurveys();
    //       location.reload();
    //     }
    //   });
    // } else {
    //   window.close();
    // }
  }

  destroySurvey(id: string) {
    // let r = window.confirm("Delete Survey?");
    // if (r == true) {
    //   this._surveyService.deleteAsset(id).subscribe(res => {
    //     console.log("DESTROY SURVEY");
    //     if (true) {
    //       this.getSurveys();
    //       location.reload();
    //     }
    //   });
    // } else {
    //   window.close();
    // }
  }

  download() {
    // const blob = new Blob([JSON.stringify(this.dataSource)], { type: 'application/json' });
    // saveAs(blob, 'surveys.json');
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
