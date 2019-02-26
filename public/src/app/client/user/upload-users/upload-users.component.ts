import { Component, Inject } from '@angular/core';

import * as XLSX from 'xlsx';
import { UserService } from '../user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditClientComponent } from '../../profile/edit-client/edit-client.component';

type AOA = any[];

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.component.html',
  styleUrls: ['./upload-users.component.css']
})

export class UploadUsersComponent {
  uploadData: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'usersList.xlsx';
  errors = [];
  show = false;

  private participant;

  constructor(
    private _userService: UserService,
    private dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  onFileChange(evt: any) {
    this.show = true;
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.uploadData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadUsers(): void {
    this.errors = [];

    const uploadedUsers = [];
    for (let i = 1; i < this.uploadData.length - 1; i++) {
      const user = this.uploadData[i];
      this.participant = {
        'name': user[0],
        'email': user[1],
        'phone': `+1${user[2]}`,
        'surveyOwner': this.data.surveyOwner,
        '_survey': this.data.survey,
        'textSent': false,
        'answeredSurvey': false
      };
      uploadedUsers.push(this.participant);
    }
    console.log('UPLOADED USERS', uploadedUsers);
    this._userService.uploadParticipants(this.data.survey, uploadedUsers).subscribe((data: any) => {
      if (data.errors) {
        console.log('*** ERROR ***', data.errors);
        for (const key of Object.keys(data.errors)) {
          const error = data.errors[key];
          this.errors.push(error.message);
        }
      } else {
        this.dialogRef.close();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  export(): void {
    const exportedUsers = [['name', 'email', 'phone']];

    console.log('Exported Users', exportedUsers);

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportedUsers);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

}
