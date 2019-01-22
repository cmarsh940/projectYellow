import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorDialogService } from '../services/error-dialog.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public errorDialogService: ErrorDialogService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                this.errorDialogService.openDialog(data);
                return throwError(error);
            }));
    }

    // intercept(req: HttpRequest<any>, next: HttpHandler) {
    //     // Get the auth token from the service.
    //     console.log("AUTH INTERCEPT", req);
    //     const authToken = this.auth.getAuthorizationToken();

    //     // Clone the request and set the new header in one step.
    //     const authReq = req.clone({ setHeaders: { Authorization: authToken } });
    //     // const authReq = req.clone({
    //     //     headers: req.headers.set('Authorization', authToken)
    //     // });

    //     // send cloned request with header to the next handler.
    //     console.log("EXITING INTERCEPT", authReq);
    //     return next.handle(authReq);
    // }

    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     console.log(`AddTokenInterceptor - ${req.url}`);

    //     const authToken = this.auth.getAuthorizationToken();

    //     if (authToken) {
    //         // Logged in. Add Bearer token.
    //         return next.handle(
    //             req.clone({
    //                 headers: req.headers.append('Authorization', authToken)
    //             })
    //         );
    //     }
    //     // Not logged in. Continue without modification.
    //     return next.handle(req);
    // }
}
