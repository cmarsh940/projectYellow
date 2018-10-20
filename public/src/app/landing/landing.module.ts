import { MainNavComponent } from '../layout/main-nav/main-nav.component';
import { MaterialModule } from '../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { RightsComponent } from './rights/rights.component';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { LandingComponent } from './landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ListSurveysComponent } from './list-surveys/list-surveys.component';
import { MainFooterComponent } from '../layout/main-footer/main-footer.component';
import { VerifiedComponent } from './verified/verified.component';

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainNavComponent,
    LandingComponent,
    RightsComponent, 
    AboutComponent,
    MainFooterComponent, 
    PricingComponent, HomeComponent, ViewSurveyComponent, ListSurveysComponent, VerifiedComponent
  ]
})
export class LandingModule { }
