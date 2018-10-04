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
    BarChartComponent
  ]
})
export class ClientModule {}
