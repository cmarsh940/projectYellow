import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig, ErrorStateMatcher } from '@angular/material';
import { Client } from '@shared/models/client';
import { states } from '@shared/models/states';
import { forbiddenNameValidator } from '@shared/validators/forbidden-name.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  newClient: Client = new Client();
  password_confirmation: string;
  currentClient: Client;
  matcher = new MyErrorStateMatcher();
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  states = states;
  currentDevice: any;
  currentPlatform: any;
  agent: any;
  errors = [];
  accountTypes = [
    {
      name: 'Business'
    },
    {
      name: 'Personal'
    },
    {
      name: 'School'
    },
    {
      name: 'Other'
    }
  ];
  private participant;
  private unsubscribe$ = new Subject();

  firstNameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
    forbiddenNameValidator(/admin/i),
    Validators.maxLength(250),
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
    forbiddenNameValidator(/admin/i),
    Validators.maxLength(250),
  ]);
  businessName = new FormControl('');
  accountType = new FormControl('');
  acceptFormControl = new FormControl('', [
    Validators.required,
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(250),
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(250),
  ]);
  confirm_pass = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(250),
  ]);
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.minLength(10),
    Validators.maxLength(12),
  ]);
  addressFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
  ]);
  cityFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
    Validators.minLength(2),
    Validators.maxLength(150),
  ]);
  stateFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
    Validators.minLength(2),
    Validators.maxLength(5),
  ]);
  postalCodeFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.minLength(5),
    Validators.maxLength(18),
  ]);

  constructor(
    private _authService: AuthService,
    private _router: Router,
    public snackBar: MatSnackBar,
    fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.myForm = fb.group({
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
      accept: this.acceptFormControl,
      accountType: this.accountType,
      businessName: this.businessName,
      email: this.emailFormControl,
      password: this.passwordFormControl,
      confirm_pass: this.confirm_pass,
      phone: this.phoneFormControl,
      address: this.addressFormControl,
      city: this.cityFormControl,
      state: this.stateFormControl,
      postalCode: this.postalCodeFormControl,
    }, { updateOn: 'blur' });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentDevice = window.clientInformation.platform;
      this.currentPlatform = window.clientInformation.vendor;
      this.agent = window.clientInformation.userAgent;
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  addParticipant(form: any) {
    this.errors = [];
    const subscription = 'FREE';
    const platform = 'EMAIL';
    this.participant = {
      'accountType': this.accountType.value,
      'firstName': this.firstNameFormControl.value,
      'lastName': this.lastNameFormControl.value,
      'businessName': this.businessName.value,
      'email': this.emailFormControl.value,
      'password': this.passwordFormControl.value,
      'confirm_pass': this.confirm_pass.value,
      'phone': `+1${this.phoneFormControl.value}`,
      'platform': platform,
      'address': this.addressFormControl.value,
      'city': this.cityFormControl.value,
      'state': this.stateFormControl.value,
      'postalCode': this.postalCodeFormControl.value,
      'subscription': subscription
    };

    this._authService.addParticipant(this.participant).pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ DATA ERROR ___:', data.errors);
          if (data.errors.password) {
            this.errors = data.errors.password.message;
          } else {
            this.errors = data.errors;
          }
        } else {
          this.errors = null;
          this.myForm.setValue({
            'accountType': null,
            'firstName': null,
            'lastName': null,
            'accept': false,
            'businessName': null,
            'email': null,
            'password': null,
            'confirm_pass': null,
            'phone': null,
            'address': null,
            'city': null,
            'state': null,
            'postalCode': null,
          });
          this.openSnackBar();
          this._router.navigateByUrl('/login');
        }
      }
    });
  }

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 10500;
    config.panelClass = ['logout-snackbar'];
    this.snackBar.open('Thank you for registering. Please verify your email to get started', '', config);
  }

}
