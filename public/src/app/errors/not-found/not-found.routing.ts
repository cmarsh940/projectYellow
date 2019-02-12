import { NotFoundComponent } from './not-found.component';
import { Routes, RouterModule } from '@angular/router';
import { SurveyErrorComponent } from '../survey-error/survey-error.component';
import { SubscriptionErrorComponent } from '../subscription-error/subscription-error.component';
import { SurveyClosedComponent } from '../survey-closed/survey-closed.component';

const routes: Routes = [
  {
    path: 'error',
    component: NotFoundComponent,
    children: [
      {
        path: 'closed',
        pathMatch: 'full',
        component: SurveyClosedComponent
      },
      {
        path: 'survey',
        pathMatch: 'full',
        component: SurveyErrorComponent
      },
      {
        path: 'subscription',
        pathMatch: 'full',
        component: SubscriptionErrorComponent
      },
    ]
  },
];

export const NotFoundRoutes = RouterModule.forChild(routes);
