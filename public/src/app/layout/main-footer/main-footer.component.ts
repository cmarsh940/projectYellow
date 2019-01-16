import { RightsComponent } from './../../landing/rights/rights.component';
import { Component } from '@angular/core';
import { MatDialog, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatSnackBarConfig, ErrorStateMatcher } from '../../../../node_modules/@angular/material';
import { FeedbackComponent } from '../feedback/feedback.component';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { UploadService } from 'src/app/global/services/upload.service';


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

  constructor(
    private _uploadService: UploadService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    fb: FormBuilder
    ) {
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
          console.log("___ DATA ERROR ___:", data.errors);
          this.errors = data.errors.email.message;
        } else {
          this.errors = null;
          this.emailSubForm.setValue({
            'email': null,
          });
          this.openSnackBar();
        }
      }
    })
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("Thank you for subscribing", '', config);
  }
}
