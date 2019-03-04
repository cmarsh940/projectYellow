import { Component, OnInit, ViewChild, OnDestroy, AfterContentChecked, ChangeDetectorRef, Inject } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { MatPaginator, MatTableDataSource, MatDialog, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploadUsersComponent } from '../upload-users/upload-users.component';

import * as XLSX from 'xlsx';
import { AddUserComponent } from '../add-user/add-user.component';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from '@shared/models/user';
import { UserService } from '../user.service';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { WarnDialogComponent } from 'app/client/warn-dialog/warn-dialog.component';

type AOA = any[];
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy, AfterContentChecked {
  errorMessage;
  errors = [];
  dataSource: any;
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  pageEvent;
  surveyId = '';
  private = false;
  loaded: Boolean;

  _routeSubscription: Subscription;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'name', 'email', 'phone', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<User>(true, []);

  uploadData: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'surveyUsers.xlsx';


  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  constructor(
    private universalStorage: UniversalStorage,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loaded = false;
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];

      this.getUsers();
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getUsers() {
    this.loaded = false;
    const id = this.surveyId;
    this._userService.getClientsUsers(id)
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Element>(response.users);
        this.dataSource.paginator = this.paginator;
        this.private = response.private;
        this.array = response.users;
        this.totalSize = this.array.length;
        this.iterator();
      });
      setTimeout(() => {
        this.loaded = true;
      }, 1000);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  moreToggleOff() {
    console.log('SELECTION IS', this.selection);
    this.selection.clear();
  }

  openUploadDialog() {
    const dialogRef = this.dialog.open(UploadUsersComponent, {
      data: {
        survey: this.surveyId,
        surveyOwner: this.universalStorage.getItem('t940')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
      console.log(`Dialog result: ${result}`);
    });
  }

  singleUploadDialog() {
    const addDialogRef = this.dialog.open(AddUserComponent, {
      data: {
        survey: this.surveyId,
        surveyOwner: this.universalStorage.getItem('t940')
      }
    });

    addDialogRef.afterClosed().subscribe(result => {
      this.getUsers();
      console.log(`Dialog result: ${result}`);
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
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  destroyUser(id: string) {
    const dialogRef = this.dialog.open(WarnDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('result is:', result);
      if (result) {
        this._userService.deleteParticipant(id).subscribe(res => {
          if (res) {
            this.getUsers();
            location.reload();
          }
        });
      }
      if (!result) {
        console.log('User not removed');
      }
    });
  }

  export(): void {

    const exportedUsers = [['name', 'email', 'phone']];
    for (const user of this.dataSource) {
      const tempUser = [];
      tempUser.push(user.name);
      tempUser.push(user.email);
      tempUser.push(user.phone);
      exportedUsers.push(tempUser);
    }
    console.log('Exported Users', exportedUsers);

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportedUsers);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }


  sendSMS(users: any): void {
    this.loaded = false;
    console.log('HIT SEND SMS');
    this.errors = [];
    this._userService.sendSMS(this.surveyId, users).subscribe((data: any) => {
      if (data) {
        if (data.errors) {
          console.log('*** ERROR ***', data.errors);
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
          }
        } else {
          console.log('HIT GET USERS');
          this.loaded = true;
          this.openSnackBar();
        }
      } else {
        this.loaded = true;
        this.errors = data;
        console.log('ERROR SENDING MESSAGE', data);
      }
    });
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 1500;
    config.panelClass = ['logout-snackbar'];
    this.loaded = true;
    this.snackBar.open('Message Sent!', '', config);
    this.getUsers();
  }
}
