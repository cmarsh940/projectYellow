import { MainFooterComponent } from './../layout/main-footer/main-footer.component';
import { MainNavComponent } from './../layout/main-nav/main-nav.component';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { RightsComponent } from './rights/rights.component';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { LandingComponent } from './landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';

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
    MainFooterComponent,
    LandingComponent,
    RightsComponent, 
    AboutComponent, 
    PricingComponent, HomeComponent
  ]
})
export class LandingModule { }
