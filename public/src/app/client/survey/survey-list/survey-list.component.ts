import { ProfileService } from './../../profile/profile.service';
import { Component, OnInit} from '@angular/core';

import { Survey } from './../../../global/models/survey';

@Component({
  selector: 'survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  dataSource: Survey[];
  errorMessage;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'category'];

  constructor(
    private _profileService: ProfileService
  ) { }

  ngOnInit() {
    this.getUserSurveys();
  }

  getUserSurveys() {
    let id = JSON.parse(sessionStorage.getItem('currentClient'));
    this._profileService.getparticipant(id)
      .subscribe(res => {
        console.log("User", res);
        this.dataSource = res.surveys;
      })
  }
}
