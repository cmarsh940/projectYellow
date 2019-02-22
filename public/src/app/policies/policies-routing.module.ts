import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoliciesComponent } from './policies.component';
import { RightsComponent } from './rights/rights.component';
import { CookiesComponent } from './cookies/cookies.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  {
    path: 'policies',
    component: PoliciesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PrivacyComponent
      },
      {
        path: 'usage',
        pathMatch: 'full',
        component: RightsComponent
      },
      {
        path: 'cookies',
        pathMatch: 'full',
        component: CookiesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciesRoutingModule { }
