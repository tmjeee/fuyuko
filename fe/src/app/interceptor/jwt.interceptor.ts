import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../service/auth-service/auth.service';

export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwtToken = this.authService.jwtToken();

        console.log('************** jwt interceptor token', jwtToken);

        let effectiveReq = req;
        if (jwtToken) {
            effectiveReq = req.clone({
                setHeaders: {
                    'x-auth-jwt': jwtToken
                }
            });
            console.log('******* effectiveReq', effectiveReq);
        }

        return next.handle(effectiveReq);
    }
}
