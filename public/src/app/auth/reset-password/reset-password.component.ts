import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  errors: any;
  clientId = '';
  requestId = '';

  requested: Boolean;
  verified: Boolean;

  private participant;

  requestForm: FormGroup;
  verifyForm: FormGroup;
  resetForm: FormGroup;

  email = new FormControl('', Validators.required);
  number = new FormControl('', Validators.required);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(250),
  ]);
  confirm_pass = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(250),
  ]);

  constructor(
    private _authService: AuthService,
    private _router: Router,
    fb: FormBuilder
  ) {

    this.requestForm = fb.group({
      email: this.email
    });

    this.verifyForm = fb.group({
      number: this.number,
    });

    this.resetForm = fb.group({
      password: this.password,
      confirm_pass: this.confirm_pass
    });
  }

  ngOnInit() {
    this.errors = null;
    this.requested = false;
    this.verified = false;
  }

  sendRequest(email: any) {
    this.requested = false;
    this.verified = false;
    this.errors = null;
    this.participant = {
      'email': this.email.value,
    };
    this._authService.requestPasswordChange(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ LOGIN ERROR ___:');
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
          }
        } else {
          console.log('SUCCESS', data);
          this.clientId = data._client;
          console.log('RETURNED CLIENT IS:', this.clientId);
          this.requestId = data._request;
          console.log('RETURNED CLIENT IS:', this.requestId);
          this.requested = true;
          this.verified = false;
        }
      } else {
        this.requested = false;
        this.verified = false;
        this.errors = 'Error requesting password reset';
      }
    });
  }

  verify(form: any) {
    if (!this.requested) {
      return this.errors.push('NEED TO REQUEST A RESET');
    }
    if (this.requested) {
      this.errors = null;
      this.verified = false;
      console.log('*** STARTING LOGIN ***');
      this.participant = {
        'clientId': this.clientId,
        'requestId': this.requestId,
        'number': this.number.value,
      };

      this._authService.verifyPasswordChange(this.participant).subscribe((data) => {
        if (data) {
          if (data.errors) {
            console.log('___ LOGIN ERROR ___:');
            this.verified = false;
            for (const key of Object.keys(data.errors)) {
              const error = data.errors[key];
              this.errors = error.message;
            }
          } else {
            console.log('SUCCESS', data);
            this.verified = true;
          }
        } else {
          this.verified = false;
          this.errors = data;
        }
      });
    }
  }

  sendReset(form: any) {
    this.errors = null;
    console.log('*** STARTING SEND RESET ***');
    this.participant = {
      'id': this.clientId,
      'resetId': this.requestId,
      'password': this.password.value,
      'confirm_pass': this.confirm_pass.value,
    };

    this._authService.resetPassword(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log('___ RESET ERROR ___:');
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors = error.message;
          }
        } else {
          console.log('SUCCESS', data);
          this._router.navigate(['/login']);
        }
      } else {
        this.errors = data;
      }
    });
  }

}
