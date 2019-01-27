import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private auth: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`AddTokenInterceptor - ${req.url}`);

        const token =  this.auth.getAuthorizationToken();

        if (token) {

            // Logged in. Add Bearer token.
            return next.handle(
                req.clone({
                    headers: req.headers.append('Authorization', `Bearer ${token}`)
                })
            );
        }
        // Not logged in. Continue without modification.
        return next.handle(req);
    }
}
