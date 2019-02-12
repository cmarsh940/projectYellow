import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutes } from './not-found.routing';
import { NotFoundService } from './not-found.service';
import { SubscriptionErrorComponent } from '../subscription-error/subscription-error.component';
import { SurveyClosedComponent } from '../survey-closed/survey-closed.component';
import { SurveyErrorComponent } from '../survey-error/survey-error.component';

@NgModule({
  imports: [CommonModule, NotFoundRoutes, TranslateModule],
  providers: [NotFoundService],
  declarations: [NotFoundComponent, SubscriptionErrorComponent, SurveyClosedComponent, SurveyErrorComponent],
})
export class NotFoundModule {}
