import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterDialogComponent } from 'src/app/auth/register-dialog/register-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;


    const dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        console.log(`Dialog Error result:`);
        console.log(result);
      } else {
        console.log(`Dialog result:`);
        console.table(result);
        this._router.navigateByUrl("/login");
      }
    });
  }
  
}
