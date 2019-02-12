import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RightsComponent } from './rights/rights.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { PricingComponent } from './pricing/pricing.component';
import { SuccessComponent } from './success/success.component';
import { SurveyClosedComponent } from './errors/survey-closed/survey-closed.component';
import { SurveyErrorComponent } from './errors/survey-error/survey-error.component';
import { SubscriptionErrorComponent } from './errors/subscription-error/subscription-error.component';
import { MetaGuard } from '@ngx-meta/core';


const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      },
      {
        path: 'about',
        pathMatch: 'full',
        component: AboutComponent
      },
      {
        path: 'rights',
        pathMatch: 'full',
        component: RightsComponent
      },
      {
        path: 'pricing',
        pathMatch: 'full',
        component: PricingComponent
      },
      {
        path: 'success',
        pathMatch: 'full',
        component: SuccessComponent
      },
      {
        path: 'closed-survey',
        pathMatch: 'full',
        component: SurveyClosedComponent
      },
      {
        path: 'survey-error',
        pathMatch: 'full',
        component: SurveyErrorComponent
      },
      {
        path: 'subscription-error',
        pathMatch: 'full',
        component: SubscriptionErrorComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
