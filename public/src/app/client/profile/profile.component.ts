import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { MatDialog, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatSnackBarConfig, MatBottomSheet } from '@angular/material';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ProfileService } from './profile.service';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionOverlayComponent } from './subscription-overlay/subscription-overlay.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { Client } from '@shared/models/client';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy {
  currentClient = new Client();
  clientId = '';
  _routeSubscription: Subscription;
  id: String;
  errors = [];
  profileUrl: string;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';


  @ViewChild('file') file;
  @ViewChild('form') form;

  public files: Set<File> = new Set();

  constructor(
    public dialog: MatDialog,
    public checkoutDialog: MatDialog,
    private _profileService: ProfileService,
    private _authService: AuthService,
    private _uploadService: UploadService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      this.clientId = params['id'];
      this.getClient();
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }


  openDialog() {
    const dialogRef = this.dialog.open(EditClientComponent, {
      data: this.currentClient,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openBottomSheet(): void {
    this.bottomSheet.open(SubscriptionOverlayComponent, {
      data: this.currentClient,
    });

  }

  openCheckout() {
    const checkoutRef = this.checkoutDialog.open(CheckoutComponent, {
      data: this.currentClient,
    });

    checkoutRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cancelSubscription(id: string) {
      const r = window.confirm('Are you sure you want to cancel your subscription');
      if (r === true) {
        this._profileService.cancelSubscription(id).subscribe(res => {
          console.log('DESTROY SURVEY');
          if (true) {
            this.getClient();
          }
        });
      } else {
        window.close();
        this.getClient();
      }
  }


  getClient() {
    this._profileService.getparticipant(this.clientId).subscribe((client: Client) => {
        this.currentClient = client;
        this.profileUrl = client.picture;
        console.log(this.currentClient);
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
    console.log('FILES', files);
    for (const key in files) {
      // tslint:disable-next-line: radix
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
        console.log('NEW FILE ADDED', files);
      }
    }
  }


  uploadPortfolio() {
    this.errors = [];
    const files: FileList = this.file.nativeElement.files;
    if (files.length === 0) {
      console.log('No File Was Selected');
      return;
    }
    const formData = new FormData(this.form.nativeElement);
    formData.append(files[0].name, files[0]);
    this._uploadService.postPortfolio(formData, this.currentClient._id).subscribe( res => {
        console.log('SUCCESS');
        this.getClient();
    });
  }

  isLoggedIn() {
    const verify = this._authService.verify();
    if (!verify) {
      this.openSnackBar();
      this._router.navigateByUrl('/login');
    } else {
      console.log('YOU ARE VERIFIED');
    }
  }

  closeAccount(id: string) {
    const r = window.confirm('Are you sure?');
    if (r === true) {
      this._profileService.disableParticipant(id).subscribe(res => {
        if (!res) {
          window.close();
        }
        if (true) {
          // tslint:disable-next-line: no-shadowed-variable
          this._authService.logout((res: any) => {
            if (!res) {
              console.log('ERROR');
            }
            console.log('Account Removed');
            this.currentClient = null;
            this._router.navigateByUrl('/');
          });
        }
      });
    } else {
      window.close();
    }
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('You are not logged in!', '', config);
  }
}
