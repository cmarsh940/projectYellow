import { CookiesComponent } from './policies/cookies/cookies.component';
import { OverviewModule } from './overview/overview.module';
import { LandingModule } from './landing/landing.module';
import { ClientModule } from './client/client.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaterialModule } from './material/material.module';
// angular
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { CookieService, CookieModule } from 'ngx-cookie';
import { TransferHttpCacheModule } from '@nguniversal/common';
// shared
import { SharedModule } from '@shared/shared.module';
import { TranslatesService } from '@shared/translates';
// components
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { UniversalStorage } from '@shared/storage/universal.storage';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SurveyService } from './client/survey/survey.service';
import { ForbiddenValidatorDirective } from '@shared/validators/forbidden-name.directive';
import { RegisterDialogComponent } from './auth/register-dialog/register-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { HttpModule } from '@angular/http';
import { AddUserComponent } from './client/user/add-user/add-user.component';
import { EditClientComponent } from './client/profile/edit-client/edit-client.component';
import { FeedbackComponent } from '@shared/feedback/feedback.component';
import { SubscriptionOverlayComponent } from './client/profile/subscription-overlay/subscription-overlay.component';
import { UploadUsersComponent } from './client/user/upload-users/upload-users.component';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from '@shared/interceptors/auth-interceptor';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { RightsComponent } from './policies/rights/rights.component';
import { PoliciesModule } from './policies/policies.module';

export function initLanguage(translateService: TranslatesService): Function {
  return (): Promise<any> => translateService.initLanguage();
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    ClientModule,
    OverviewModule,
    LandingModule,
    PoliciesModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutes,
    MaterialModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ForbiddenValidatorDirective,
    RegisterDialogComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  providers: [
    AuthService,
    CookieService,
    SurveyService,
    UniversalStorage,
    { provide: APP_INITIALIZER, useFactory: initLanguage, multi: true, deps: [TranslatesService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  entryComponents: [
    AddUserComponent,
    EditClientComponent,
    FeedbackComponent,
    SubscriptionOverlayComponent,
    RegisterDialogComponent,
    RightsComponent,
    CookiesComponent,
    UploadUsersComponent
  ]
})
export class AppModule {}
