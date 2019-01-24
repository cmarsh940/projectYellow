import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterDialogComponent } from 'src/app/auth/register-dialog/register-dialog.component';
import { MatDialog } from '@angular/material';
import { Client } from 'src/app/global/models/client';
import { Router } from '@angular/router';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  opened: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(RegisterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result:`);
      console.table(result);
      this._router.navigateByUrl("/login");
    });
  }
  
}
