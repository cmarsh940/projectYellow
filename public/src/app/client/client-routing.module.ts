import { SurveyAnalyticsComponent } from './survey/survey-analytics/survey-analytics.component';
import { EditClientComponent } from './profile/edit-client/edit-client.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ClientComponent } from './client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AddSurveyComponent } from './survey/add-survey/add-survey.component';
import { SurveyComponent } from './survey/survey.component';
import { EditSurveyComponent } from './survey/edit-survey/edit-survey.component';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  {
    path: "",
    component: ClientComponent,
    children: [
      {
        path: "dashboard",
        pathMatch: "full",
        component: DashboardComponent
      },
      {
        path: "checkout/:id/:id",
        pathMatch: "full",
        component: CheckoutComponent,
      },
      {
        path: "profile/:id",
        pathMatch: "full",
        component: ProfileComponent,
      },
      {
        path: "profile/edit/:id",
        pathMatch: "full",
        component: EditClientComponent
      },
      {
        path: "survey",
        pathMatch: "full",
        component: SurveyComponent
      },
      {
        path: "survey/add",
        pathMatch: "full",
        component: AddSurveyComponent
      },
      {
        path: "survey/edit/:id",
        pathMatch: "full",
        component: EditSurveyComponent
      },
      {
        path: "survey/analytics/:id",
        pathMatch: "full",
        component: SurveyAnalyticsComponent
      },
      {
        path: "user/:id",
        pathMatch: "full",
        component: UserComponent
      },
      {
        path: "user/:id/add",
        pathMatch: "full",
        component: AddUserComponent
      },
      {
        path: "user/:id/:id",
        pathMatch: "full",
        component: EditUserComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
