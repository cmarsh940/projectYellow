import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';



const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: RegisterComponent
  },
  {
    path: 'change-password',
    pathMatch: 'full',
    component: ResetPasswordComponent
  },
  {
    path: '404error',
    pathMatch: 'full',
    component: PageNotFoundComponent
  },
  {
    path: 'dashboard',
    loadChildren: './client/client.module#ClientModule'
  },
  {
    path: 'overview',
    loadChildren: './overview/overview.module#OverviewModule'
  },
  {
    path: '',
    loadChildren: './landing/landing.module#LandingModule'
  },
  { path: '**', redirectTo: '404error' },
];
// must use {initialNavigation: 'enabled'}) - for one load page, without reload
export const AppRoutes = RouterModule.forRoot(routes, { initialNavigation: 'enabled' });
