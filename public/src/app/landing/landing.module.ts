import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { RightsComponent } from './rights/rights.component';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { LandingComponent } from './landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { VerifiedComponent } from './verified/verified.component';
import { SuccessComponent } from './success/success.component';
import { MainFooterComponent } from '@shared/layouts/main-footer/main-footer.component';
import { PoweredByComponent } from '@shared/powered-by/powered-by.component';
import { MaterialModule } from 'app/material/material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [
    LandingComponent,
    RightsComponent,
    AboutComponent,
    PricingComponent,
    HomeComponent,
    VerifiedComponent,
    PoweredByComponent,
    SuccessComponent,
  ]
})
export class LandingModule { }
