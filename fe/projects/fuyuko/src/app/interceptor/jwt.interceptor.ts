import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../service/auth-service/auth.service';
import {Injectable} from '@angular/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwtToken = this.authService.jwtToken();

        let effectiveReq = req;
        if (jwtToken) {
            effectiveReq = req.clone({
                setHeaders: {
                    'x-auth-jwt': jwtToken
                }
            });
        }

        return next.handle(effectiveReq);
    }
}
