import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import { ReportComponent } from './report/report.component';
import { ClientReportComponent } from './client-report/client-report.component';
import { SurveyReportComponent } from './survey-report/survey-report.component';
import { SurveyCategoryReportComponent } from './survey-category-report/survey-category-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { RoleReportComponent } from './role-report/role-report.component';
import { SubscriptionReportComponent } from './subscription-report/subscription-report.component';

const routes: Routes = [
  {
    path: "",
    component: OverviewComponent,
    children: [
      {
        path: "overview",
        pathMatch: "full",
        component: ReportComponent
      },
      {
        path: "clientReport",
        pathMatch: "full",
        component: ClientReportComponent
      },
      {
        path: "surveyReport",
        pathMatch: "full",
        component: SurveyReportComponent
      },
      {
        path: "surveyCategoriesReport",
        pathMatch: "full",
        component: SurveyCategoryReportComponent
      },
      {
        path: "userReport",
        pathMatch: "full",
        component: UserReportComponent
      },
      {
        path: "roleReport",
        pathMatch: "full",
        component: RoleReportComponent
      },
      {
        path: "subscriptionReport",
        pathMatch: "full",
        component: SubscriptionReportComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule { }
