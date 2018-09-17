import { Location } from '@angular/common';
import { ProfileService } from './../../profile/profile.service';
import { Component, OnInit, ViewChild} from '@angular/core';

import { Survey } from './../../../global/models/survey';
import { Client } from '../../../global/models/client';
import { MatPaginator, MatSort } from '@angular/material';
import { SurveyService } from '../survey.service';
import { merge } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  dataSource: Survey[];
  currentClient: Client;
  errorMessage;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

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
      .subscribe(res => {
        this.dataSource = res.surveys;
        console.log("DATA:", this.dataSource);
      })
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
}
