import { EmailSub } from './../../shared/models/emailSub';
import { Component, OnInit, AfterContentChecked, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { OverviewService } from '../overview.service';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.css']
})
export class EmailReportComponent implements OnInit, AfterContentChecked {
  errors; any;

  allEmails = [];

  // PAGINATE
  dataSource: any;
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  legth = 0;
  pageEvent;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created', 'email', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _overviewService: OverviewService,
    private cdref: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadAll();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadAll(): Promise<any> {
    return this._overviewService.getAllEmails()
      .toPromise()
      .then((result) => {
        console.log('all jobs are:', result);
        this.errors = null;
        this.dataSource = new MatTableDataSource<Element>(result);
        this.dataSource.paginator = this.paginator;
        this.array = result;
        if (!this.array) {
          this.totalSize = 0;
        } else {
          this.totalSize = this.array.length;
        }
      })
      .catch((error) => {
        console.log('Error', error);
      });
  }

  TrackById(index: number, email: EmailSub) {
    return email._id;
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

  destroy(id: string) {
    this._overviewService.deleteEmail(id).subscribe(res => {
      console.log('DESTROY EMAIL', res);
      if (true) {
        this.loadAll();
      }
    });
  }
}
