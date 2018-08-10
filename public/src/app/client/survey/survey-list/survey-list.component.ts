import { Component, OnInit} from '@angular/core';

import { Survey } from './../../../global/models/survey';
import { SurveyService } from '../survey.service';

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
    private _surveyService: SurveyService
  ) { }

  ngOnInit() {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this._surveyService.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          tempList.push(asset);
        });
        this.dataSource = tempList;
        console.log("*** SURVEYS RETURNED ***:", this.dataSource);
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }
}
