import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User } from 'src/app/global/models/user';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploadUsersComponent } from '../upload-users/upload-users.component';

import * as XLSX from 'xlsx';
import { AddUserComponent } from '../add-user/add-user.component';
import { SelectionModel } from '@angular/cdk/collections';

type AOA = any[];
@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  errorMessage;
  dataSource: any;
  array: any;
  resultsLength = 0;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  pageEvent;
  surveyId = '';
  private = false;

  _routeSubscription: Subscription

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'name', 'email', 'phone', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<User>(true, []);

  uploadData: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'surveyUsers.xlsx';

  

  
  constructor(
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.surveyId = params['id'];

      this.getUsers();
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }


  getUsers() {
    let id = this.surveyId;
    this._userService.getClientsUsers(id)
      .subscribe((response) => {
        console.log("GET USERS RESPONSE", response);
        this.dataSource = new MatTableDataSource<Element>(response.users);
        console.log("THE DATA SOURCE IS:", this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.private = response.private;
        this.array = response.users;
        this.totalSize = this.array.length;
        this.iterator();
        
      })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    console.log("SELECTION", this.selection);
    const numSelected = this.selection.selected.length;
    console.log("THE DATA SOURCE IS:")
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  openUploadDialog() {
    const dialogRef = this.dialog.open(UploadUsersComponent, {
      data: {
        survey: this.surveyId,
        surveyOwner: JSON.parse(localStorage.getItem('t940'))
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
        surveyOwner: JSON.parse(localStorage.getItem('t940'))
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
    let r = window.confirm("Delete User?");
    if (r == true) {
      this._userService.deleteParticipant(id).subscribe(res => {
        if (res) {
          this.getUsers();
          location.reload();
        } else {
          console.log("ERROR DELETING USER", res);
          location.reload();
        }

      });
    } else {
      window.close();
    }
  }

  export(): void {

    let exportedUsers = [['name', 'email', 'phone']];
    for (const user of this.dataSource) {
      let tempUser = [];
      tempUser.push(user.name);
      tempUser.push(user.email);
      tempUser.push(user.phone);
      exportedUsers.push(tempUser);
    }
    console.log("Exported Users", exportedUsers);

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportedUsers);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
