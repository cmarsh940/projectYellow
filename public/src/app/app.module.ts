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

// COMPONENTS
import { AppComponent } from './app.component';
import { EditClientComponent } from './client/profile/edit-client/edit-client.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RightsComponent } from './landing/rights/rights.component';

// ENVIORMENTS
import { environment } from '../environments/environment';

// INTERCEPTORS
import { httpInterceptorProviders } from './global/interceptors';

// SERVICES
import { AuthService } from './auth/auth.service';
import { ClientService } from './client/client.service';
import { HttpErrorHandler } from './global/services/http-error-handler.service';
import { MessagesService } from './global/services/messages.service';
import { RequestCache, RequestCacheWithMap } from './global/services/cache.service';
import { SurveyService } from './client/survey/survey.service';
import { UserService } from './client/user/user.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    LandingModule,
    ClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [
    HttpErrorHandler,
    AuthService,
    MessagesService,
    ClientService,
    SurveyService,
    UserService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
    httpInterceptorProviders
  ],
  entryComponents: [
    EditClientComponent,
    RightsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
