import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
export class ProfilingInterceptor {
    intercept(req, next) {
        const startTime = new Date().getTime();
        return next
            .handle(req)
            .pipe(tap((e) => {
            if (e instanceof HttpResponse) {
                const url = e.url;
                const endTime = new Date().getTime();
                const totalTime = endTime - startTime;
                console.log(`[profiling] ${url} took ${totalTime} ms`);
            }
        }));
    }
}
//# sourceMappingURL=profiling.interceptor.js.map