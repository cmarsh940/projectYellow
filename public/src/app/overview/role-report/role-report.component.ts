import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';
import { MatDialog } from '@angular/material';
import { Role } from '../../global/models/role';
import { AddRoleComponent } from './add-role/add-role.component';


export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-role-report',
  templateUrl: './role-report.component.html',
  styleUrls: ['./role-report.component.css']
})
export class RoleReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'action'];
  dataSource: Role[];
  allRoles;
  errorMessage;
  errors = [];
  name: string;



  constructor(
    private _roleService: RoleService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this._roleService.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(role => {
          tempList.push(role);
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
      })
  }



  addDialog() {
    this.errors = [];
    const dialogRef = this.dialog.open(AddRoleComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
      this.loadAll();
    });
  }

  destroyRole(id: string) {
    let r = window.confirm("Delete Role?");
    if (r == true) {
      this._roleService.deleteAsset(id);
    } else {
      window.close()
    }
  }

  deleteAsset(id: string): Promise<any> {
    let r = window.confirm("Delete Role?");
    if (r == true) {
      return this._roleService.deleteAsset(id)
        .toPromise()
        .then(() => {
          this.errorMessage = null;
          this.loadAll();
        })
        .catch((error) => {
          if (error == 'Server error') {
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
          }
          else if (error == '404 - Not Found') {
            this.errorMessage = "404 - Could not find API route. Please check your available APIs."
          }
          else {
            this.errorMessage = error;
          }
        });
    } else {
      window.close()
    }
  }
}
