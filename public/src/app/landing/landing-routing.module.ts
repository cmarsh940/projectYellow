import { AboutComponent } from './about/about.component';
import { RightsComponent } from './rights/rights.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: LandingComponent
      },
      {
        path: "about",
        pathMatch: "full",
        component: AboutComponent
      },
      {
        path: "rights",
        pathMatch: "full",
        component: RightsComponent
      },
      {
        path: "pricing",
        pathMatch: "full",
        component: PricingComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
