import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizationServiceRepository } from '../services/authorization/authorization.service.repository';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ConfigurationService } from '../../configuration/services/configuration.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    public configuration: any;

    constructor(
        private router: Router,
        private configurationService: ConfigurationService
    ) {
        this.configuration = this.configurationService.getConfig();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = AuthorizationServiceRepository.getCurrentTokenValue();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            tap(
                () => {
                },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status !== 401) {
                            return;
                        }

                        this.router.navigateByUrl('/auth/login');
                    }
                }
            )
        );
    }

}
