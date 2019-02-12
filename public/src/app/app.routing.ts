import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';

import { WrapperComponent } from '@shared/layouts/wrapper/wrapper.component';
import { SubscriptionErrorComponent } from './errors/subscription-error/subscription-error.component';


const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        loadChildren: './landing/landing.module#LandingModule'
      },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      {
        path: 'mock',
        loadChildren: './mock-server-browser/mock-server-browser.module#MockServerBrowserModule',
      },
      { path: 'async', loadChildren: './http-async/http-async.module#HttpAsyncModule' },
      {
        path: 'error',
        loadChildren: './not-found/not-found.module#NotFoundModule'
      },
      { path: '**', loadChildren: './not-found/not-found.module#NotFoundModule' },
    ],
  },
];
// must use {initialNavigation: 'enabled'}) - for one load page, without reload
export const AppRoutes = RouterModule.forRoot(routes, { initialNavigation: 'enabled' });
