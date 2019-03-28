import { AddCategoryComponent } from './survey-category-report/add-category/add-category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';
import { ReportComponent } from './report/report.component';
import { ClientReportComponent } from './client-report/client-report.component';
import { SurveyReportComponent } from './survey-report/survey-report.component';
import { SurveyCategoryReportComponent } from './survey-category-report/survey-category-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { SubscriptionReportComponent } from './subscription-report/subscription-report.component';
import { EditCategoryComponent } from './survey-category-report/edit-category/edit-category.component';
import { FeedbackReportComponent } from './feedback-report/feedback-report.component';
import { EmailReportComponent } from './email-report/email-report.component';

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ReportComponent
      },
      {
        path: 'clientReport',
        pathMatch: 'full',
        component: ClientReportComponent
      },
      {
        path: 'emailReport',
        pathMatch: 'full',
        component: EmailReportComponent
      },
      {
        path: 'feedbackReport',
        pathMatch: 'full',
        component: FeedbackReportComponent
      },
      {
        path: 'surveyReport',
        pathMatch: 'full',
        component: SurveyReportComponent
      },
      {
        path: 'surveyCategoriesReport',
        pathMatch: 'full',
        component: SurveyCategoryReportComponent
      },
      {
        path: 'addCategory',
        pathMatch: 'full',
        component: AddCategoryComponent
      },
      {
        path: 'category/edit/:id',
        pathMatch: 'full',
        component: EditCategoryComponent
      },
      {
        path: 'userReport',
        pathMatch: 'full',
        component: UserReportComponent
      },
      {
        path: 'subscriptionReport',
        pathMatch: 'full',
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
