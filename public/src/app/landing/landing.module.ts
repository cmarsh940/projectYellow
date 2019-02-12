import { MainFooterComponent } from '@shared/layouts/main-footer/main-footer.component';
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
import { PoweredByComponent } from '@shared/powered-by/powered-by.component';
import { MaterialModule } from 'app/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionErrorComponent } from './errors/subscription-error/subscription-error.component';
import { SurveyErrorComponent } from './errors/survey-error/survey-error.component';
import { SurveyClosedComponent } from './errors/survey-closed/survey-closed.component';
import { MainNavComponent } from '@shared/layouts/main-nav/main-nav.component';

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
    MainNavComponent,
    MainFooterComponent,
    SubscriptionErrorComponent,
    SurveyErrorComponent,
    SurveyClosedComponent,
    SuccessComponent,
  ]
})
export class LandingModule { }
