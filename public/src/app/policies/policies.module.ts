import { MaterialModule } from './../material/material.module';
import { PoliciesComponent } from './policies.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliciesRoutingModule } from './policies-routing.module';
import { RightsComponent } from './rights/rights.component';
import { CookiesComponent } from './cookies/cookies.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarComponent } from '@shared/layouts/toolbar/toolbar.component';

@NgModule({
  declarations: [
    RightsComponent,
    CookiesComponent,
    PoliciesComponent,
    PrivacyComponent,
    ToolbarComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PoliciesRoutingModule,
    TranslateModule
  ]
})
export class PoliciesModule { }
