import { SurveyCategoryService } from 'app/overview/survey-category-report/survey-category.service';
import { Component, OnInit } from '@angular/core';
import { SurveyCategory } from '@shared/models/survey-category';
import { OverviewService } from '../overview.service';

@Component({
  selector: 'app-survey-category-report',
  templateUrl: './survey-category-report.component.html',
  styleUrls: ['./survey-category-report.component.css']
})
export class SurveyCategoryReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surveys', 'action'];
  dataSource: SurveyCategory[];
  errorMessage;

  constructor(
    private _overviewService: OverviewService,
    private _surveyCategory: SurveyCategoryService
  ) { }

  ngOnInit() {
    this.loadAll();
  }


  loadAll(): Promise<any> {
    const tempList = [];
    return this._overviewService.getAllCategories()
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

  destroy(id: string) {
    this._surveyCategory.deleteAsset(id).subscribe(res => {
      console.log('DESTROY SURVEY', res);
      if (true) {
        this.loadAll();
        location.reload();
      }
    });
  }
}
