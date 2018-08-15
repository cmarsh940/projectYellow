import { SurveyCategoryService } from './survey-category.service';
import { Component, OnInit } from '@angular/core';
import { SurveyCategory } from '../../../global/models/survey-category';

@Component({
  selector: 'app-survey-category',
  templateUrl: './survey-category.component.html',
  styleUrls: ['./survey-category.component.css']
})
export class SurveyCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'action'];
  dataSource: SurveyCategory[];
  errorMessage;

  constructor(private _surveyCategory: SurveyCategoryService) { }

  ngOnInit() {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this._surveyCategory.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          tempList.push(asset);
        });
        this.dataSource = tempList;
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
