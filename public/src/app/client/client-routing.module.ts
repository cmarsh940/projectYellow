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
        path: "profile",
        pathMatch: "full",
        component: ProfileComponent
      },
      {
        path: "profile/:id",
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
        path: "survey/:id",
        pathMatch: "full",
        component: EditSurveyComponent
      },
      {
        path: "user",
        pathMatch: "full",
        component: UserComponent
      },
      {
        path: "user/:id",
        pathMatch: "full",
        component: EditUserComponent
      },
      {
        path: "user/add",
        pathMatch: "full",
        component: AddUserComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
