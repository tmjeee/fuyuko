import {Injectable} from '@angular/core';
import {Job, JobAndLogs} from '@fuyuko-common/model/job.model';
import {Observable, of} from 'rxjs';
import {BulkEditPackage} from '@fuyuko-common/model/bulk-edit.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';
import {assertDefinedReturn} from '../../utils/common.util';


const URL_SCHEDULE_BULK_EDIT_JOB = () => `${config().api_host_url}/view/:viewId/bulk-edit`;
const URL_JOB_BY_ID = () => `${config().api_host_url}/job/:jobId`;
const URL_JOB_DETAIL_BY_ID = () => `${config().api_host_url}/job/:jobId/details`;
const URL_JOB_DETAIL_BY_ID_2 = () => `${config().api_host_url}/job/:jobId/details/:lastLogId`;
const URL_ALL_JOBS = () => `${config().api_host_url}/jobs`;


@Injectable()
export class JobsService {

    constructor(private httpClient: HttpClient) {}

    allJobs(): Observable<Job[]> {
        return this.httpClient
            .get<ApiResponse<Job[]>>(URL_ALL_JOBS())
            .pipe(
                map((r: ApiResponse<Job[]>) => assertDefinedReturn(r.payload))
            );
    }

    scheduleBulkEditJob(viewId: number, bulkEditPackage: BulkEditPackage): Observable<Job> {
        return this.httpClient.post<ApiResponse<Job>>(
            URL_SCHEDULE_BULK_EDIT_JOB().replace(':viewId', `${viewId}`), {
               bulkEditPackage
            }).pipe(map((r: ApiResponse<Job>) => assertDefinedReturn(r.payload)));
    }

    job(jobId: number): Observable<Job> {
        return this.httpClient
            .get<ApiResponse<Job>>(URL_JOB_BY_ID().replace(':jobId', `${jobId}`))
            .pipe(
                map((r: ApiResponse<Job>) => assertDefinedReturn(r.payload))
            );
    }

    jobLogs(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        return this.httpClient.get<ApiResponse<JobAndLogs>>(
            (lastLogId ?
                    URL_JOB_DETAIL_BY_ID_2()
                        .replace(':jobId', `${jobId}`)
                        .replace(':lastLogId', `${lastLogId}`) :
                    URL_JOB_DETAIL_BY_ID()
                        .replace(':jobId', `${jobId}`)))
            .pipe(
                map((r: ApiResponse<JobAndLogs>) => assertDefinedReturn(r.payload))
            );
    }
}
