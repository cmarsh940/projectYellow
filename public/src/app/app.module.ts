import { LandingModule } from './landing/landing.module';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './auth/login/login.component';
import { UserService } from './services/user.service';
import { MessagesService } from './services/messages.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { ClientModule } from './client/client.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterComponent } from './auth/register/register.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { httpInterceptorProviders } from './interceptors';
import { RequestCache, RequestCacheWithMap } from './services/cache.service';
import { MainFooterComponent } from './layout/main-footer/main-footer.component';


@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MainFooterComponent],
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
    MessagesService,
    UserService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
