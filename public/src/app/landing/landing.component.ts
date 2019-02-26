import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';
import { MetaService } from '@ngx-meta/core';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: TransferHttpService,
    private readonly meta: MetaService,
    private universalStorage: UniversalStorage,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      let resultCookie = this.universalStorage.getItem('c0a');
      if (!resultCookie) {
        this.openSnackBar();
      } else {
        console.log('landing resultCookie was found:', resultCookie);
      }
      const t = window;
      const t1 = document;
      this.meta.setTag('description', 'Surveys by ME is providing professional surveys, designed for simplicity and ease of use. We provide surveys for large corperations, small businesses, students, and many more. Create your free survey today.');
    }
  }

  openSnackBar() {
    const message = 'This application uses cookies to ensure you get the best experience on our site.';
    const action = true;
    const actionButtonLabel = 'Ok';
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.panelClass = ['cookie-snackbar'];
    let snackBarRef = this.snackBar.open(message, action ? actionButtonLabel : undefined, config);
    snackBarRef.onAction().subscribe(() => {
      this.universalStorage.setItem('c0a', JSON.stringify(Date.now()));
    });
  }
}
