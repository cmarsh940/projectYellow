import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveyService } from '../../client/survey/survey.service';
import { Survey } from '../../global/models/survey';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['owner', 'name', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
          if(!asset.private) {
            tempList.push(asset);
          }
        });
        this.dataSource = new MatTableDataSource<Element>(tempList);
        this.dataSource.paginator = this.paginator;
        this.array = tempList;
        console.table(tempList);
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
