import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SurveyCategory } from '../../global/models/survey-category';
import { SurveyCategoryService } from './survey-category.service';

@Component({
  selector: 'app-survey-category-report',
  templateUrl: './survey-category-report.component.html',
  styleUrls: ['./survey-category-report.component.css']
})
export class SurveyCategoryReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'action'];
  dataSource: SurveyCategory[];
  errorMessage;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _surveyCategory: SurveyCategoryService
  ) { }

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
