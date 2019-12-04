import {Injectable} from '@angular/core';
import {Job, JobAndLogs} from '../../model/job.model';
import {Observable, of} from 'rxjs';
import {BulkEditPackage} from '../../model/bulk-edit.model';
import config from '../../../assets/config.json';
import {HttpClient} from '@angular/common/http';


const URL_SCHEDULE_BULK_EDIT_JOB = `${config.api_host_url}/view/:viewId/bulk-edit`;
const URL_JOB_BY_ID = `${config.api_host_url}/job/:jobId`;
const URL_JOB_DETAIL_BY_ID = `${config.api_host_url}/job/:jobId/details`;
const URL_ALL_JOBS = `${config.api_host_url}/jobs`;


@Injectable()
export class JobsService {

    constructor(private httpClient: HttpClient) {}

    allJobs(): Observable<Job[]> {
        return this.httpClient.get<Job[]>(URL_ALL_JOBS);
    }

    scheduleBulkEditJob(viewId: number, bulkEditPackage: BulkEditPackage): Observable<Job> {
        return this.httpClient.post<Job>(
            URL_SCHEDULE_BULK_EDIT_JOB.replace(':viewId', `${viewId}`), {
               bulkEditPackage
            });
    }

    job(jobId: number): Observable<Job> {
        return this.httpClient.get<Job>(URL_JOB_BY_ID.replace(':jobId', `${jobId}`));
    }

    jobLogs(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        return this.httpClient.get<JobAndLogs>(
            URL_JOB_DETAIL_BY_ID.replace(':jobId', `${jobId}`).replace(':lastLogId', `${lastLogId}`));
    }
}
