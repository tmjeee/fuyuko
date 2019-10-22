import {Injectable} from '@angular/core';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {Job, JobAndLogs, Log} from '../../model/job.model';
import {Observable, of} from 'rxjs';

const allJobs: Job[] = [
    { id: 1, name: 'job #1', status: 'completed', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 2, name: 'job #2', status: 'completed', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 3, name: 'job #3', status: 'failed', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 4, name: 'job #4', status: 'scheduled', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 5, name: 'job #5', status: 'scheduled', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 6, name: 'job #6', status: 'in-progress', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 7, name: 'job #7', status: 'in-progress', creationDate: new Date(), lastUpdate: new Date()} as Job,
    { id: 8, name: 'job #8', status: 'in-progress', creationDate: new Date(), lastUpdate: new Date()} as Job,
];


@Injectable()
export class JobsService {

    allJobs(): Observable<Job[]> {
        return of(allJobs);
    }

    scheduleBulkEditJob(viewId: number, changeClauses: ItemValueAndAttribute[], whereClauses: ItemValueOperatorAndAttribute[]):
        Observable<Job> {
        const job: Job =  {
            id: allJobs.length,
            status: 'scheduled',
            lastUpdate: new Date(),
            creationDate: new Date(),
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
            if (jobFound.status === 'scheduled') {
                jobFound.status = 'in-progress';
            }
            let logId = (lastLogId ?  (lastLogId + 1) : 1);
            for (let a = 0; a < Math.ceil(Math.random() * 10); a++) {
                logs.push({id: logId, level: 'info', timestamp: new Date(), message: `log messages ${new Date()}`} as Log);
                logId++;
            }
            if (jobFound.status === 'in-progress') {
                jobFound.status = 'completed';
            }
        }
        return of({ job: jobFound, logs} as JobAndLogs);
    }
}
