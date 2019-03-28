import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { OverviewService } from '../overview.service';
import { ViewFeedbackComponent } from './view-feedback/view-feedback.component';
import { Feedback } from '@shared/models/feedback';

@Component({
  selector: 'app-feedback-report',
  templateUrl: './feedback-report.component.html',
  styleUrls: ['./feedback-report.component.css']
})
export class FeedbackReportComponent implements OnInit, AfterContentChecked {
  errors; any;

  allFeedback = [];

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
  displayedColumns = ['created', 'feedbackType', 'status', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
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
    return this._overviewService.getAllfeedbacks()
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

  viewFeedback(feedback: any) {
    const dialogRef = this.dialog.open(ViewFeedbackComponent, {
      data: feedback,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  TrackById(index: number, feedback: Feedback) {
    return feedback._id;
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

  markAsRead(id: any) {
    let data = {
      status: 'VIEWED'
    };
    this._overviewService.updateFeedback(id, data).subscribe((data: any) => {
      if (data) {
        console.log('updated client is:', data);
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          this.loadAll();
        }
      }
    });
  }
  closeFeedback(id: any) {
    let data = {
      status: 'CLOSED'
    };
    this._overviewService.updateFeedback(id, data).subscribe((data: any) => {
      if (data) {
        console.log('updated client is:', data);
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          this.loadAll();
        }
      }
    });
  }
  openFeedback(id: any) {
    let data = {
      status: 'OPENED'
    };
    this._overviewService.updateFeedback(id, data).subscribe((data: any) => {
      if (data) {
        console.log('updated client is:', data);
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          this.loadAll();
        }
      }
    });
  }

}
