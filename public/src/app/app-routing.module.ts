import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    pathMatch: "full",
    component: RegisterComponent
  },
  {
    path: "dashboard",
    loadChildren: "./client/client.module#ClientModule"
  },
  {
    path: "overview",
    loadChildren: "./overview/overview.module#OverviewModule"
  },
  {
    path: "",
    loadChildren: "./landing/landing.module#LandingModule"
  }
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
