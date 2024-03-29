import { AddCategoryComponent } from './survey-category-report/add-category/add-category.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import { ReportComponent } from './report/report.component';
import { SurveyReportComponent } from './survey-report/survey-report.component';
import { ClientReportComponent } from './client-report/client-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { SurveyCategoryReportComponent } from './survey-category-report/survey-category-report.component';
import { SubscriptionReportComponent } from './subscription-report/subscription-report.component';
import { EditCategoryComponent } from './survey-category-report/edit-category/edit-category.component';
import { OverviewNavComponent } from '@shared/layouts/overview-nav/overview-nav.component';
import { OverviewService } from './overview.service';
import { FeedbackReportComponent } from './feedback-report/feedback-report.component';
import { EmailReportComponent } from './email-report/email-report.component';
import { ViewFeedbackComponent } from './feedback-report/view-feedback/view-feedback.component';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    OverviewComponent,
    OverviewNavComponent,
    ReportComponent,
    SurveyReportComponent,
    ClientReportComponent,
    UserReportComponent,
    SurveyCategoryReportComponent,
    EditCategoryComponent,
    AddCategoryComponent,
    SubscriptionReportComponent,
    FeedbackReportComponent,
    EmailReportComponent,
    ViewFeedbackComponent
  ],
  providers: [
    OverviewService
  ]
})
export class OverviewModule { }
