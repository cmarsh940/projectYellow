import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { UserService } from '../../client/user/user.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { OverviewService } from '../overview.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '@shared/models/user';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit, AfterContentChecked {
  error; any;

  allParticipants = [];

  // PAGINATE
  dataSource: any;
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  legth = 0;
  pageEvent;

  private participant;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created', 'name', 'surveyOwner', 'answered', 'action'];

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
    return this._overviewService.getAllUsers()
      .toPromise()
      .then((result) => {
        console.log('all users are:', result);
        this.error = null;
        this.allParticipants = result;
        this.allParticipants.forEach(participant => {
          let name = `${participant.firstName} ${participant.lastName}`;
          participant.name = name;
        });
        this.dataSource = new MatTableDataSource<Element>(this.allParticipants);
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

  TrackById(index: number, user: User) {
    return user._id;
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
