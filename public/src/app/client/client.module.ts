import { BarChartComponent } from './../global/d3/bar-chart/bar-chart.component';
import { ClientNavComponent } from '../layout/client-nav/client-nav.component';
import { ClientComponent } from './client.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SurveyComponent } from './survey/survey.component';
import { AddSurveyComponent } from './survey/add-survey/add-survey.component';
import { EditSurveyComponent } from './survey/edit-survey/edit-survey.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { UsersListComponent } from './user/users-list/users-list.component';
import { ProfileComponent } from './profile/profile.component';
import { EditClientComponent } from './profile/edit-client/edit-client.component';
import { SurveyAnalyticsComponent } from './survey/survey-analytics/survey-analytics.component';
import { DonutChartComponent } from '../global/d3/donut-chart/donut-chart.component';
import { PieChartComponent } from '../global/d3/pie-chart/pie-chart.component';
import { LineChartComponent } from '../global/d3/line-chart/line-chart.component';
import { AreaChartComponent } from '../global/d3/area-chart/area-chart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SubscriptionOverlayComponent } from './profile/subscription-overlay/subscription-overlay.component';
@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    ClientComponent,
    ClientNavComponent,
    CheckoutComponent,
    UserComponent,
    AddUserComponent,
    EditUserComponent,
    DashboardComponent,
    SurveyComponent,
    AddSurveyComponent,
    EditSurveyComponent,
    SurveyListComponent,
    UsersListComponent,
    ProfileComponent,
    EditClientComponent,
    SurveyAnalyticsComponent,
    BarChartComponent,
    DonutChartComponent,
    PieChartComponent,
    LineChartComponent,
    AreaChartComponent,
    SubscriptionOverlayComponent
  ]
})
export class ClientModule {}
