import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';
import { CookieOptions } from 'ngx-cookie';
import { UniversalStorage } from '@shared/storage/universal.storage';

@Component({
  selector: 'app-accept-cookie',
  templateUrl: './accept-cookie.component.html',
  styleUrls: ['./accept-cookie.component.css']
})
export class AcceptCookieComponent implements OnInit {
  exp = (new Date(Date.now() + 86400 * 1000)).toUTCString();
  cookieOptions = { expires: this.exp } as CookieOptions;

  constructor(
    private universalStorage: UniversalStorage,
    private snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
    ) { }

  ngOnInit() {
  }

  accept() {
    this.universalStorage.setItem('c0a', JSON.stringify(Date.now()), this.cookieOptions);
    this.snackBar.dismiss();
  }
}
