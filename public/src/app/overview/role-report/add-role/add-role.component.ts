import { Component, OnInit, Inject } from '@angular/core';
import { RoleService } from '../role.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Role } from '../../../global/models/role';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent {
  myForm: FormGroup;

  allAssets;
  private asset;
  errorMessage;

  name = new FormControl('', Validators.required);

  constructor(
    private _roleService: RoleService,
    private dialogRef: MatDialogRef<AddRoleComponent>,
    fb: FormBuilder
    // @Inject(MAT_DIALOG_DATA) public data: Role
  ) {
    this.myForm = fb.group({
      name: this.name,
    });
   }

  addRole(form: any): Promise<any> {
    this.asset = {
      'name': this.name.value,
    };

    this.myForm.setValue({
      'name': null,
    });

    return this._roleService.addAsset(this.asset)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.myForm.setValue({
          'name': null,
        });
        this.dialogRef.close();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          this.errorMessage = error;
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
