import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
      {
        path: '',
        loadChildren: './landing/landing.module#LandingModule'
      },
];
// must use {initialNavigation: 'enabled'}) - for one load page, without reload
export const AppRoutes = RouterModule.forRoot(routes, { initialNavigation: 'enabled' });
