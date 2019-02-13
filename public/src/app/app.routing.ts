import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';



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
    path: '404error',
    pathMatch: 'full',
    component: PageNotFoundComponent
  },
  {
    path: 'overview',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadChildren: './client/client.module#ClientModule'
  },
  {
    path: '',
    loadChildren: './landing/landing.module#LandingModule'
  },
  { path: '**', redirectTo: '404error' },
];
// must use {initialNavigation: 'enabled'}) - for one load page, without reload
export const AppRoutes = RouterModule.forRoot(routes, { initialNavigation: 'enabled' });
