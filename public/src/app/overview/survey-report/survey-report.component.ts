import { Component, OnInit, AfterContentChecked, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '@shared/models/survey';
import { MatPaginator } from '@angular/material';
import { OverviewService } from '../overview.service';


export interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-survey-report',
  templateUrl: './survey-report.component.html',
  styleUrls: ['./survey-report.component.css']
})
export class SurveyReportComponent implements OnInit, AfterContentChecked {
  dataSource: any;
  errors: any;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['owner', 'name', 'category', 'action'];

  // PAGINATE
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  legth = 0;
  pageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _overviewService: OverviewService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadAll();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this._overviewService.getAllSurveys()
      .toPromise()
      .then((result) => {
        console.log('data', result);
        this.errors = null;
        result.forEach(asset => {
          tempList.push(asset);
        });
        this.dataSource = tempList;
        this.dataSource.paginator = this.paginator;
        this.array = result;
        if (!this.array) {
          this.totalSize = 0;
        } else {
          this.totalSize = this.array.length;
        }
      })
      .catch((error) => {
        console.log('Retreaving Surveys Error', error);
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
    if (this.array) {
      const end = (this.currentPage + 1) * this.pageSize;
      const start = this.currentPage * this.pageSize;
      const part = this.array.slice(start, end);
      this.dataSource = part;
    }
  }

}
