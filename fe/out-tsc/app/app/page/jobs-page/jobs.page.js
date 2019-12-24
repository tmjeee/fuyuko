import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { JobsService } from '../../service/jobs-service/jobs.service';
import { map } from 'rxjs/operators';
let JobsPageComponent = class JobsPageComponent {
    constructor(jobService) {
        this.jobService = jobService;
    }
    ngOnInit() {
        this.fetchFn = this.f.bind(this);
        this.jobService.allJobs()
            .pipe(map((jobs) => {
            this.jobs = jobs;
        })).subscribe();
    }
    f(jobId, lastLogId) {
        return this.jobService.jobLogs(jobId, lastLogId);
    }
};
JobsPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './jobs.page.html',
        styleUrls: ['./jobs.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [JobsService])
], JobsPageComponent);
export { JobsPageComponent };
//# sourceMappingURL=jobs.page.js.map