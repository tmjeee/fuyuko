import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
let JobDetailsComponent = class JobDetailsComponent {
    constructor() {
        this.fetch = false;
        this.logs = [];
    }
    ngOnChanges(changes) {
    }
    ngOnInit() {
        // one time fetch
        if (this.fetchFn) {
            const lastLogId = (this.logs && this.logs.length > 0) ? this.logs[this.logs.length - 1].id : undefined;
            this.fetchFn(this.job.id, lastLogId).pipe(map((l) => {
                this.logs.push(...l.logs);
                this.job = l.job;
            })).subscribe();
        }
        this.scheduleJobLogsFetch();
    }
    ngOnDestroy() {
        this.unscheduleJobLogsFetch();
    }
    scheduleJobLogsFetch() {
        this.timeoutHandler = setTimeout(() => {
            if (this.fetchFn && this.fetch) {
                const lastLogId = (this.logs && this.logs.length > 0) ? this.logs[this.logs.length - 1].id : undefined;
                this.fetchFn(this.job.id, lastLogId).pipe(map((l) => {
                    this.logs.push(...l.logs);
                    this.job = l.job;
                    if (this.job && this.jobHasMoreLogs(this.job)) {
                        this.scheduleJobLogsFetch();
                    }
                })).subscribe();
            }
        }, 1000);
    }
    unscheduleJobLogsFetch() {
        if (this.timeoutHandler !== null && this.timeoutHandler !== undefined) {
            clearTimeout(this.timeoutHandler);
        }
    }
    jobHasMoreLogs(job) {
        return (job && (job.progress !== 'COMPLETED' && job.progress !== 'FAILED'));
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], JobDetailsComponent.prototype, "job", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], JobDetailsComponent.prototype, "fetch", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], JobDetailsComponent.prototype, "fetchFn", void 0);
JobDetailsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-job-details',
        templateUrl: './job-details.component.html',
        styleUrls: ['./job-details.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], JobDetailsComponent);
export { JobDetailsComponent };
//# sourceMappingURL=job-details.component.js.map