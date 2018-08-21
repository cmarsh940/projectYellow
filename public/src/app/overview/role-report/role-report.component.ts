import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RoleService } from './role.service';
import { MatDialog } from '@angular/material';
import { Role } from '../../global/models/role';
import { AddRoleComponent } from './add-role/add-role.component';

@Component({
  selector: 'app-role-report',
  templateUrl: './role-report.component.html',
  styleUrls: ['./role-report.component.css']
})
export class RoleReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'action'];
  dataSource: Role[];
  myForm: FormGroup;
  allRoles;
  errorMessage;
  private role;

  name = new FormControl('', Validators.required);


  constructor(
    private _roleService: RoleService,
    public dialog: MatDialog, 
    fb: FormBuilder) {
    this.myForm = fb.group({
      name: this.name,
    });
  };

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



	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the role field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }


  addDialog() {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      data: this.role,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      return this._roleService.add(result)
        .toPromise()
        .then(() => {
          this.errorMessage = null;
          this.loadAll();
        })
        .catch((error) => {
          if (error === 'Server error') {
            this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
          } else {
            this.errorMessage = error;
          }
        });
    });
  }

}
