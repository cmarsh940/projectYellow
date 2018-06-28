import { DashboardComponent } from './client/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "register",
    pathMatch: "full",
    component: RegisterComponent
  },
  {
    path: "dashboard",
    loadChildren: "./Components/client/client.module#ClientModule"
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true, // <-- debugging purposes only
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
