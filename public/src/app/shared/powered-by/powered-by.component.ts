import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'powered-by',
  templateUrl: './powered-by.component.html',
  styleUrls: ['./powered-by.component.css']
})
export class PoweredByComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  openRegister() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.closeOnNavigation = true;
    // dialogConfig.maxWidth = '22em'


    // const dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!result) {
    //     console.log(`Dialog Error result:`);
    //     console.log(result);
    //   } else {
    //     console.log(`Dialog result:`);
    //     console.table(result);
    //     this._router.navigateByUrl("/login");
    //   }
    // });
  }

}
