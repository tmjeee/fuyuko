export class JwtInterceptor {
    constructor(authService) {
        this.authService = authService;
    }
    intercept(req, next) {
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
//# sourceMappingURL=jwt.interceptor.js.map