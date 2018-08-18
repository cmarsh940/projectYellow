import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';
import { SurveyCategory } from '../../../global/models/survey-category';
import { SurveyCategoryService } from './survey-category.service';

@Component({
  selector: 'app-survey-category',
  templateUrl: './survey-category.component.html',
  styleUrls: ['./survey-category.component.css']
})
export class SurveyCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'action'];
  dataSource: SurveyCategory[];
  errorMessage;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _surveyCategory: SurveyCategoryService
  ) { }

  ngOnInit() {
    this.isLoggedIn();
    this.loadAll();
  }

  isLoggedIn() {
    if (this._authService.getCurrentClient() == null) {
      this._router.navigateByUrl('/login');
    }
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
