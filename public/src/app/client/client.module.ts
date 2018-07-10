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
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { SurveyComponent } from './survey/survey.component';
import { AddSurveyComponent } from './survey/add-survey/add-survey.component';
import { EditSurveyComponent } from './survey/edit-survey/edit-survey.component';
import { SurveyCategoryComponent } from './survey/survey-category/survey-category.component';
import { AddCategoryComponent } from './survey/survey-category/add-category/add-category.component';
import { EditCategoryComponent } from './survey/survey-category/edit-category/edit-category.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { UsersListComponent } from './user/users-list/users-list.component';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
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
    SurveyCategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    SurveyListComponent,
    UsersListComponent,
  ]
})
export class ClientModule {}
