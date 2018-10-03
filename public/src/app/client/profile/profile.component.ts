import { UploadService } from './../../global/services/upload.service';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Client } from './../../global/models/client';
import { MatDialog, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ProfileService } from './profile.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentClient= new Client();
  clientId = '';
  _routeSubscription: Subscription;
  id: String;
  errors = [];

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';


  @ViewChild('file') file;
  @ViewChild('form') form;

  public files: Set<File> = new Set();

  constructor(
    public dialog: MatDialog,
    private _profileService: ProfileService,
    private _authService: AuthService,
    private _uploadService: UploadService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.clientId = params['id'];
      this.getClient();
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(EditClientComponent, {
      data: this.currentClient,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  getClient() {
    this._profileService.getparticipant(this.clientId).subscribe((client: Client) => {
        this.currentClient = client;
      },
      (error: any) => {
        if (error) {
          for (const key of Object.keys(error)) {
            const errors = error[key];
            this.errors.push(errors.message);
          }
        }
      });
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    console.log("FILES", files);
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
        console.log("NEW FILE ADDED", files);
      }
    }
  }


  uploadPortfolio() {
    this.errors = [];
    const files: FileList = this.file.nativeElement.files;
    if (files.length === 0) {
      console.log("No File Was Selected");
      return;
    }
    const formData = new FormData(this.form.nativeElement);
    formData.append(files[0].name, files[0]);
    this._uploadService.postPortfolio(formData, this.currentClient._id).subscribe( res => {  
        console.log("SUCCESS");
        this.getClient();
    });
  }

  isLoggedIn() {
    let verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    } else {
      console.log("YOU ARE VERIFIED");
    }
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("You are not logged in!", '', config);
  }
}
