import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
// tslint:disable-next-line: max-line-length
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatDialog, MatSnackBar, MatIconRegistry, MatSnackBarConfig } from '@angular/material';
import { RightsComponent } from 'app/policies/rights/rights.component';
import { FeedbackComponent } from '@shared/feedback/feedback.component';
import { UploadService } from '@shared/services/upload.service';


@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent {
  errors: any;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  emailSubForm: FormGroup;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(250),
  ]);

  private emailSub;

  facebookUrl = 'https://www.facebook.com/SurveysbyME/';
  contactEmail = 'mailto:surveysbyme@mellcgroup.com';

  constructor(
    private _uploadService: UploadService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    fb: FormBuilder
    ) {
    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));

    this.emailSubForm = fb.group({
      email: this.emailFormControl,
    }, { updateOn: 'blur' });
   }

  openDialog() {
    const dialogRef = this.dialog.open(RightsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openFeedback() {
    const feedbackRef = this.dialog.open(FeedbackComponent);

    feedbackRef.afterClosed().subscribe(result => {
      console.log(`Feedback result: ${result}`);
    });
  }

  addEmailSub(form: any) {
    this.errors = null;
    this.emailSub = {
      'email': this.emailFormControl.value,
    };

    this._uploadService.addEmailSub(this.emailSub).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ DATA ERROR ___:', data.errors);
          this.errors = data.errors.email.message;
        } else {
          this.errors = null;
          this.emailSubForm.setValue({
            'email': null,
          });
          this.openSnackBar();
        }
      }
    });
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('Thank you for subscribing', '', config);
  }
}
