import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { PricingComponent } from './pricing/pricing.component';
import { SuccessComponent } from './success/success.component';
import { SurveyClosedComponent } from './errors/survey-closed/survey-closed.component';
import { SurveyErrorComponent } from './errors/survey-error/survey-error.component';
import { SubscriptionErrorComponent } from './errors/subscription-error/subscription-error.component';
import { MetaGuard } from '@ngx-meta/core';
import { ListSurveysComponent } from './list-surveys/list-surveys.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { PrivateSurveyComponent } from './private-survey/private-survey.component';


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
        path: 'pricing',
        pathMatch: 'full',
        component: PricingComponent
      },
      {
        path: 'subscription-error',
        pathMatch: 'full',
        component: SubscriptionErrorComponent
      },
      {
        path: 'success',
        pathMatch: 'full',
        component: SuccessComponent
      },
      {
        path: 'survey-closed',
        pathMatch: 'full',
        component: SurveyClosedComponent
      },
      {
        path: 'survey-error',
        pathMatch: 'full',
        component: SurveyErrorComponent
      },
      {
        path: 'survey-list',
        pathMatch: 'full',
        component: ListSurveysComponent
      },
      {
        path: 'takeSurvey/:id',
        pathMatch: 'full',
        component: ViewSurveyComponent
      },
      {
        path: 'pSurvey/:id/:id',
        pathMatch: 'full',
        component: PrivateSurveyComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
