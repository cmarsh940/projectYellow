import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ClientService } from '../../client/client.service';
import { Client } from '@shared/models/client';
import { MatPaginator } from '@angular/material';
import { OverviewService } from '../overview.service';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css']
})
export class ClientReportComponent implements OnInit, AfterContentChecked {
  dataSource: any;
  errorMessage;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created', 'name', 'surveys', 'sub', 'action'];

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
    return this._overviewService.getAllClients()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(participent => {
          let name = `${participent.firstName} ${participent.lastName}`;
          participent.name = name;
          if (participent.role === 'SKIPPER') {
            participent.role = 'admin';
          }
          tempList.push(participent);
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
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }

  TrackById(index: number, client: Client) {
    return client._id;
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
