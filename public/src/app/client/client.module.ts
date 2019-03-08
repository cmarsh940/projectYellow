import { WarnDialogComponent } from './warn-dialog/warn-dialog.component';
import { CheckoutService } from './checkout/checkout.service';
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
import { CheckoutComponent } from './checkout/checkout.component';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './user/users-list/users-list.component';
import { ProfileComponent } from './profile/profile.component';
import { EditClientComponent } from './profile/edit-client/edit-client.component';
import { SubscriptionOverlayComponent } from './profile/subscription-overlay/subscription-overlay.component';
import { UploadUsersComponent } from './user/upload-users/upload-users.component';
import { ProfileService } from './profile/profile.service';
import { ClientService } from './client.service';
import { NotificationComponent } from './notification/notification.component';
import { DisableAccountComponent } from './profile/disable-account/disable-account.component';
import { ShareSurveyDialogComponent } from './survey/share-survey-dialog/share-survey-dialog.component';

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
    NotificationComponent,
    SurveyComponent,
    AddSurveyComponent,
    EditSurveyComponent,
    SurveyListComponent,
    SurveyAnalyticsComponent,
    UsersListComponent,
    ProfileComponent,
    EditClientComponent,
    SubscriptionOverlayComponent,
    UploadUsersComponent,
    DisableAccountComponent,
    WarnDialogComponent,
    ShareSurveyDialogComponent
  ],
  providers: [
    ProfileService,
    ClientService,
    CheckoutService
  ]
})
export class ClientModule {}
