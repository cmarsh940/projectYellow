import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { RightsComponent } from './rights/rights.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { PricingComponent } from './pricing/pricing.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { ListSurveysComponent } from './list-surveys/list-surveys.component';
import { VerifiedComponent } from './verified/verified.component';
import { PrivateSurveyComponent } from './private-survey/private-survey.component';
import { SuccessComponent } from './success/success.component';
import { SurveyErrorComponent } from './survey-error/survey-error.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';
import { SurveyClosedComponent } from './survey-closed/survey-closed.component';

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    children: [
      {
        path: "",
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
        path: "change-password",
        pathMatch: "full",
        component: ResetPasswordComponent
      },
      {
        path: "list_of_surveys",
        pathMatch: "full",
        component: ListSurveysComponent
      },
      {
        path: "takeSurvey/:id",
        pathMatch: "full",
        component: ViewSurveyComponent
      },
      {
        path: "pSurvey/:id/:id",
        pathMatch: "full",
        component: PrivateSurveyComponent
      },
      {
        path: "closed",
        pathMatch: "full",
        component: SurveyClosedComponent
      },
      {
        path: "success",
        pathMatch: "full",
        component: SuccessComponent
      },
      {
        path: "surveyError",
        pathMatch: "full",
        component: SurveyErrorComponent
      },
      {
        path: "verified/:id/:id",
        pathMatch: "full",
        component: VerifiedComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
