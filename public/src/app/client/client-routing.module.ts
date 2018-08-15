import { EditCategoryComponent } from './survey/survey-category/edit-category/edit-category.component';
import { UserComponent } from './user/user.component';
import { AddSurveyComponent } from './survey/add-survey/add-survey.component';
import { SurveyComponent } from './survey/survey.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditSurveyComponent } from './survey/edit-survey/edit-survey.component';
import { SurveyCategoryComponent } from './survey/survey-category/survey-category.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { AddCategoryComponent } from './survey/survey-category/add-category/add-category.component';

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
        path: "survey_categories",
        pathMatch: "full",
        component: SurveyCategoryComponent
      },
      {
        path: "survey_categories/add",
        pathMatch: "full",
        component: AddCategoryComponent
      },
      {
        path: "category/edit/:id",
        pathMatch: "full",
        component: EditCategoryComponent
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
