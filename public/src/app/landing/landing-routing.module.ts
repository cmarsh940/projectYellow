import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RightsComponent } from './rights/rights.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { PricingComponent } from './pricing/pricing.component';
import { SuccessComponent } from './success/success.component';


const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {
      meta: {
        title: 'landing.title',
        description: 'landing.text',
        override: true,
      },
    },
    children: [
      {
        path: '',
        pathMatch: "full",
        component: HomeComponent
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
      {
        path: "success",
        pathMatch: "full",
        component: SuccessComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
