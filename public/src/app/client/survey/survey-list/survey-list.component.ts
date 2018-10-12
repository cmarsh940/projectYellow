import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { Client } from '../../../global/models/client';
import { ProfileService } from './../../profile/profile.service';
import { Survey } from './../../../global/models/survey';
import { SurveyService } from '../survey.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  currentClient: Client;
  errorMessage;

  // PAGINATE
  dataSource: any;
  array: any;
  resultsLength = 0; 
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  pageEvent;

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
    let id = surveyOwner._id;
    this._profileService.getparticipant(id)
      .subscribe((response) => {
        console.table(response);
        this.dataSource = new MatTableDataSource<Element>(response._surveys);
        this.dataSource.paginator = this.paginator;
        this.array = response._surveys;
        this.totalSize = this.array.length;
        this.iterator();
      });
  }

  destroySurvey(id: string) {
    let r = window.confirm("Delete Survey?");
    if (r == true) {
      this._surveyService.deleteAsset(id).subscribe(res => {
        console.log("DESTROY SURVEY");
        if (true) {
          this.getSurveys();
          location.reload();
        }
      });
    } else {
      window.close();
    }
  }

  download() {
    const blob = new Blob([JSON.stringify(this.dataSource)], { type: 'application/json' });
    saveAs(blob, 'surveys.json');
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
