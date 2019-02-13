import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    @Inject(LOCAL_STORAGE) private localStorage: any;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem('token');

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    `Bearer ${idToken}`)
            });
            console.log('SENDING CLONED HEADERS');
            return next.handle(cloned);
        } else {
            console.log('SENDING WITHOUT HEADERS');
            return next.handle(req);
        }
    }
}
