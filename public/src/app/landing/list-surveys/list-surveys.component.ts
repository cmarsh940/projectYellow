import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Survey } from '@shared/models/survey';
import { SurveyService } from 'app/client/survey/survey.service';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-list-surveys',
  templateUrl: './list-surveys.component.html',
  styleUrls: ['./list-surveys.component.css']
})
export class ListSurveysComponent implements OnInit {
  errorMessage;
  dataSource: any;
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  pageEvent;
  logedIn: boolean;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['owner', 'name', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _authService: AuthService,
    private _surveyService: SurveyService,
    @Inject('ORIGIN_URL') public baseUrl: string,
  ) {
    console.log(`ORIGIN_URL=${baseUrl}`);
  }

  ngOnInit() {
    this.checkLogedIn();
    this.loadAll();
  }

  checkLogedIn() {
    let response = this._authService.checkLoggedIn();
    this.logedIn = response;
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this._surveyService.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          if (!asset.private) {
            tempList.push(asset);
          }
        });
        this.dataSource = new MatTableDataSource<Element>(tempList);
        this.dataSource.paginator = this.paginator;
        this.array = tempList;
        this.totalSize = this.array.length;
        this.iterator();
      })
      .catch((error) => {
        if (error) {
          this.errorMessage = error;
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
