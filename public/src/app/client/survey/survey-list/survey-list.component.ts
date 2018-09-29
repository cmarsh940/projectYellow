import { Location } from '@angular/common';
import { ProfileService } from './../../profile/profile.service';
import { Component, OnInit, ViewChild} from '@angular/core';

import { Survey } from './../../../global/models/survey';
import { Client } from '../../../global/models/client';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SurveyService } from '../survey.service';
import { merge } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  dataSource: any; 
  currentClient: Client;
  errorMessage;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  array: any;

  pageSize = 10;
  currentPage = 0;
  totalSize = 0;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created', 'name', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _profileService: ProfileService,
    private _surveyService: SurveyService
  ) { }

  ngOnInit() {
    this.getSurveys();

  }

  getSurveys() {
    let surveyOwner = JSON.parse(sessionStorage.getItem('currentClient'));
    let id = surveyOwner._id
    console.log("__ID__:", id);
    this._profileService.getparticipant(id)
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Element>(response.surveys);
        this.dataSource.paginator = this.paginator;
        this.array = response.surveys;
        this.totalSize = this.array.length;
        this.iterator();
      });
  }

  destroySurvey(id: string) {
    this._surveyService.deleteAsset(id).subscribe(res => {
      console.log("DESTROY SURVEY", res);
      if(true) {
        this.getSurveys();
        location.reload();
      }
    });
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
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }
}
