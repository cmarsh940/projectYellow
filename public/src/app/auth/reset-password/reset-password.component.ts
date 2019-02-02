import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Client } from 'src/app/global/models/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  errors = [];
  requestForm: FormGroup;
  requested: Boolean;
  verified: Boolean;
  verifyForm: FormGroup;
  resetForm: FormGroup;
  client: Client;
  private participant;

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
          console.log("___ LOGIN ERROR ___:");
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
          }
        } else {
          console.log("SUCCESS", data);
          this.requested = true;
          this.verified = false;
        }
      } else {
        this.errors = data;
      }
    });
  }

  verify(form: any) {
    if (!this.requested) {
      console.log("NEED TO REQUEST A RESET");
      return false;
    }
    if (this.requested) {
      this.errors = null;
      this.verified = false;
      console.log("*** STARTING LOGIN ***")
      this.participant = {
        'number': this.number.value,
      };

      this._authService.verifyPasswordChange(this.participant).subscribe((data) => {
        if (data) {
          if (data.errors) {
            console.log("___ LOGIN ERROR ___:");
            this.verified = false;
            for (const key of Object.keys(data.errors)) {
              const error = data.errors[key];
              this.errors.push(error.message);
            }
          } else {
            console.log("SUCCESS", data);
            this.client = data;
            this.verified = true
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
    console.log("*** STARTING SEND RESET ***")
    this.participant = {
      'id': this.client._id,
      'resetId': this.client.resetId,
      'password': this.password.value,
      'confirm_pass': this.confirm_pass.value,
    };

    this._authService.requestPasswordChange(this.participant).subscribe((data) => {
      if (data) {
        if (data.errors) {
          console.log("___ RESET ERROR ___:");
          for (const key of Object.keys(data.errors)) {
            const error = data.errors[key];
            this.errors.push(error.message);
          }
        } else {
          console.log("SUCCESS", data);
          this._router.navigate(['/login'])
        }
      } else {
        this.errors = data;
      }
    });
  }

}
