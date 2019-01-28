import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem("token");

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    `Bearer ${idToken}`)
            });
            console.log("SENDING CLONED HEADERS");
            return next.handle(cloned);
        }
        else {
            console.log("SENDING WITHOUT HEADERS");
            return next.handle(req);
        }
    }
}
