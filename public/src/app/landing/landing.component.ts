import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';
import { MetaService } from '@ngx-meta/core';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {



  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: TransferHttpService,
    private readonly meta: MetaService,
    private universalStorage: UniversalStorage
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.universalStorage.setItem('landing', JSON.stringify(Date.now()));
      let resultCookie = this.universalStorage.getItem('landing');
      console.log('landing resultCookie:', resultCookie);
      const t = window;
      const t1 = document;
      this.meta.setTag('description', 'Surveys by ME is providing professional surveys, designed for simplicity and ease of use. We provide surveys for large corperations, small businesses, students, and many more. Create your free survey today.');
    }
  }
}
