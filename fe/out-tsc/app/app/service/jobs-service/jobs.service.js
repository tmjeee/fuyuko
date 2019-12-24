import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import config from '../../../assets/config.json';
import { HttpClient } from '@angular/common/http';
const URL_SCHEDULE_BULK_EDIT_JOB = `${config.api_host_url}/view/:viewId/bulk-edit`;
const URL_JOB_BY_ID = `${config.api_host_url}/job/:jobId`;
const URL_JOB_DETAIL_BY_ID = `${config.api_host_url}/job/:jobId/details`;
const URL_ALL_JOBS = `${config.api_host_url}/jobs`;
let JobsService = class JobsService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    allJobs() {
        return this.httpClient.get(URL_ALL_JOBS);
    }
    scheduleBulkEditJob(viewId, bulkEditPackage) {
        return this.httpClient.post(URL_SCHEDULE_BULK_EDIT_JOB.replace(':viewId', `${viewId}`), {
            bulkEditPackage
        });
    }
    job(jobId) {
        return this.httpClient.get(URL_JOB_BY_ID.replace(':jobId', `${jobId}`));
    }
    jobLogs(jobId, lastLogId) {
        return this.httpClient.get(URL_JOB_DETAIL_BY_ID.replace(':jobId', `${jobId}`).replace(':lastLogId', `${lastLogId}`));
    }
};
JobsService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], JobsService);
export { JobsService };
//# sourceMappingURL=jobs.service.js.map