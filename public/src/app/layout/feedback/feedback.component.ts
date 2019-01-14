import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UploadService } from 'src/app/global/services/upload.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  errors = [];
  feedbackForm: FormGroup;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  public files: Set<File> = new Set();

  @ViewChild('file') file;
  @ViewChild('form') form;

  // SET UP FEEDBACK MODEL
  private feedback;

  emailFormControl = new FormControl('');
  feedbackTypeFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
    Validators.maxLength(50),
  ]);
  messageFormControl = new FormControl('', [
    Validators.required
  ]);
  nameFormControl = new FormControl('');
  ratingFormControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private _uploadService: UploadService,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // INITIALIZE FEEDBACK FORM
    this.feedbackForm = fb.group({
      email: this.emailFormControl,
      feedbackType: this.feedbackTypeFormControl,
      message: this.messageFormControl,
      name: this.nameFormControl,
      rating: this.ratingFormControl,
      
    }, { updateOn: 'blur' });
  }

  ngOnInit() {}


  addFeedback(form: any) {
    this.errors = [];
    this.feedback = {
      'email': this.emailFormControl.value,
      'feedbackType': this.feedbackTypeFormControl.value,
      'message': this.messageFormControl.value,
      'name': this.nameFormControl.value,
      'rating': this.ratingFormControl.value,
    }
  
    this._uploadService.postFeedback(this.feedback).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log("___ DATA ERROR ___:", data.errors);
            this.errors.push(data.errors);
        } else {
          this.errors = null;
          this.feedbackForm.setValue({
            'email': null,
            'feedbackType': null,
            'message': null,
            'name': null,
            'rating': null,
          });
          this.openSnackBar();
        }
      }
      this.errors.push(data);
    })
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3500;
    config.panelClass = ['logout-snackbar']
    this.snackBar.open("Thank you for your feedback.", '', config);
    this.dialogRef.close();
  }

}
