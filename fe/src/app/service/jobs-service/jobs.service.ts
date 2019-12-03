import {Injectable} from '@angular/core';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {Job, JobAndLogs, Log} from '../../model/job.model';
import {Observable, of} from 'rxjs';
import {BulkEditPackage} from '../../model/bulk-edit.model';

const allJobs: Job[] = [
    { id: 1, name: 'job #1', status: 'ENABLED', progress: 'COMPLETED', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 2, name: 'job #2', status: 'ENABLED', progress: 'COMPLETED', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 3, name: 'job #3', status: 'ENABLED', progress: 'FAILED', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 4, name: 'job #4', status: 'ENABLED', progress: 'SCHEDULED', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 5, name: 'job #5', status: 'ENABLED', progress: 'SCHEDULED', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 6, name: 'job #6', status: 'ENABLED', progress: 'IN_PROGRESS', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 7, name: 'job #7', status: 'ENABLED', progress: 'IN_PROGRESS', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 8, name: 'job #8', status: 'ENABLED', progress: 'IN_PROGRESS', creationDate: new Date(), lastUpdate: new Date()} as Job,
];


@Injectable()
export class JobsService {

    allJobs(): Observable<Job[]> {
        return of(allJobs);
    }

    scheduleBulkEditJob(bulkEditPackage: BulkEditPackage): Observable<Job> {
        const job: Job =  {
            id: allJobs.length,
            lastUpdate: new Date(),
            creationDate: new Date(),
            status: 'ENABLED',
            progress: 'SCHEDULED',
            name: `Bulk edit #${allJobs.length}`
        } as Job;
        allJobs.unshift(job);
        return of(job);
    }

    job(jobId: number): Observable<Job> {
        const jobFound: Job = allJobs.find((j: Job) => j.id === jobId);
        return of(jobFound);
    }

    jobLogs(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        // todo:
        const logs: Log[] = [];
        const jobFound: Job = allJobs.find((j: Job) => j.id === jobId);
        if (jobFound) {
            if (jobFound.progress === 'SCHEDULED') {
                jobFound.progress = 'IN_PROGRESS';
            }
            let logId = (lastLogId ?  (lastLogId + 1) : 1);
            for (let a = 0; a < Math.ceil(Math.random() * 10); a++) {
                logs.push({id: logId, level: 'INFO', timestamp: new Date(), message: `log messages ${new Date()}`} as Log);
                logId++;
            }
            if (jobFound.progress === 'IN_PROGRESS') {
                jobFound.progress = 'COMPLETED';
            }
        }
        return of({ job: jobFound, logs} as JobAndLogs);
    }
}
