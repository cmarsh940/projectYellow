import { ClientComponent } from './client.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SurveyComponent } from './survey/survey.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { SurveyAnalyticsComponent } from './survey/survey-analytics/survey-analytics.component';
import { AddSurveyComponent } from './survey/add-survey/add-survey.component';
import { EditSurveyComponent } from './survey/edit-survey/edit-survey.component';
import { ClientNavComponent } from '@shared/layouts/client-nav/client-nav.component';

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
    // CheckoutComponent,
    // UserComponent,
    // AddUserComponent,
    // EditUserComponent,
    // DashboardComponent,
    SurveyComponent,
    AddSurveyComponent,
    EditSurveyComponent,
    SurveyListComponent,
    SurveyAnalyticsComponent,
    // UsersListComponent,
    // ProfileComponent,
    // EditClientComponent,
    // SubscriptionOverlayComponent,
    // UploadUsersComponent
  ]
})
export class ClientModule {}
