import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { RegisterDialogComponent } from 'app/auth/register-dialog/register-dialog.component';
import { ILang, TranslatesService } from '@shared/translates';


const LINKS: any[] = [
  { link: '/about', name: 'Why Us', icon: 'info_outline' },
  { link: '/pricing', name: 'Pricing', icon: 'attach_money' },
  { link: '/survey-list', name: 'Surveys', icon: 'ballot' },
  { link: '/policies', name: 'Policies', icon: 'info' },
];

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  public langList$: Observable<ILang[]>;
  public currentLang: string;
  opened: boolean;
  public links: any[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _translatesService: TranslatesService
  ) {}


  ngOnInit(): void {
    this.langList$ = this._translatesService.getLangList();
    this.currentLang = this._translatesService.getCurrentLang();
    const linkTemp = JSON.parse(JSON.stringify(LINKS));
    this.links = linkTemp.map((link) => {
      link.name = `${link.name}`;
      return link;
    });
  }

  public changeLang(code: string): void {
    this._translatesService.changeLang(code);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.closeOnNavigation = true;
    dialogConfig.maxWidth = '22em';


    const dialogRef = this.dialog.open(RegisterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(`Dialog Error result:`);
        console.log(result);
      } else {
        console.log(`Dialog result:`);
        console.table(result);
        this._router.navigateByUrl('/login');
      }
    });
  }

}
