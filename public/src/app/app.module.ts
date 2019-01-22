import { ErrorDialogService } from './global/services/error-dialog.service';
import { AddUserComponent } from './client/user/add-user/add-user.component';


// MODULES
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ClientModule } from './client/client.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { LandingModule } from './landing/landing.module';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { OverviewModule } from './overview/overview.module';

// COMPONENTS
import { AppComponent } from './app.component';
import { EditClientComponent } from './client/profile/edit-client/edit-client.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RightsComponent } from './landing/rights/rights.component';
import { SubscriptionOverlayComponent } from './client/profile/subscription-overlay/subscription-overlay.component';

// ENVIORMENTS
import { environment } from '../environments/environment';

// INTERCEPTORS
import { httpInterceptorProviders } from './global/interceptors';

// SERVICES
import { AuthService } from './auth/auth.service';
import { ClientService } from './client/client.service';
import { HttpErrorHandler } from './global/services/http-error-handler.service';
import { MessagesService } from './global/services/messages.service';
import { OverviewService } from './overview/overview.service';
import { RequestCache, RequestCacheWithMap } from './global/services/cache.service';
import { SubscriptionService } from './overview/subscription-report/subscription.service';
import { SurveyService } from './client/survey/survey.service';
import { SurveyCategoryService } from './overview/survey-category-report/survey-category.service';
import { UploadService } from './global/services/upload.service';
import { UserService } from './client/user/user.service';


// VALIDATORS
import { ForbiddenValidatorDirective } from './global/validators/forbidden-name.directive';

// GUARDS
import { AuthGuard } from './global/guards/auth.guard';
import { UploadUsersComponent } from './client/user/upload-users/upload-users.component';
import { FeedbackComponent } from './layout/feedback/feedback.component';
import { RegisterDialogComponent } from './auth/register-dialog/register-dialog.component';
import { ErrorDialogComponent } from './global/handlers/error-dialog/error-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForbiddenValidatorDirective,
    FeedbackComponent,
    RegisterDialogComponent,
    ErrorDialogComponent,
  ],

  imports: [
    BrowserModule,
    LandingModule,
    ClientModule,
    HttpClientModule,
    OverviewModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [
    AuthGuard,
    HttpErrorHandler,
    AuthService,
    ErrorDialogService,
    MessagesService,
    ClientService,
    SurveyService,
    SurveyCategoryService,
    UserService,
    UploadService,
    OverviewService,
    SubscriptionService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
    httpInterceptorProviders
  ],
  entryComponents: [
    AddUserComponent,
    EditClientComponent,
    ErrorDialogComponent,
    FeedbackComponent,
    SubscriptionOverlayComponent,
    RegisterDialogComponent,
    RightsComponent,
    UploadUsersComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
