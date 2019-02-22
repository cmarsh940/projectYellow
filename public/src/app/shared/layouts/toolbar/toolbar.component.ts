import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TranslatesService, ILang } from '@shared/translates';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

const LINKS: any[] = [
  { link: '/', name: 'Home', icon: 'home' },
  { link: '/policies/usage', name: 'Privacy', icon: 'info_outline' },
  { link: '/policies/cookies', name: 'Cookies', icon: 'info_outline' },
];
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  public langList$: Observable<ILang[]>;
  public currentLang: string;
  public links: any[] = [];
  opened: boolean;


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    public dialog: MatDialog,
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
}
