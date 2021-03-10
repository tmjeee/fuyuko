import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Job, JobAndLogs, JobLog} from '@fuyuko-common/model/job.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnChanges, OnDestroy, OnInit {

    @Input() job: Job;
    @Input() fetch: boolean;
    @Input() fetchFn: (jobId: number, lastLogId: number) => Observable<JobAndLogs>;

    timeoutHandler: any;
    logs: JobLog[];

    constructor() {
        this.fetch = false;
        this.logs = [];
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit(): void {
        // one time fetch
        if (this.fetchFn) {
            const lastLogId = (this.logs && this.logs.length > 0) ? this.logs[this.logs.length - 1].id : undefined;
            this.fetchFn(this.job.id, lastLogId).pipe(
                map((l: JobAndLogs) => {
                    this.logs.push(...l.logs);
                    this.job = l.job;
                })
            ).subscribe();
        }
        this.scheduleJobLogsFetch();
    }

    ngOnDestroy(): void {
        this.unscheduleJobLogsFetch();
    }

    scheduleJobLogsFetch() {
        this.timeoutHandler = setTimeout(() => {
            if (this.fetchFn && this.fetch) {
                const lastLogId = (this.logs && this.logs.length > 0) ? this.logs[this.logs.length - 1].id : undefined;
                this.fetchFn(this.job.id, lastLogId).pipe(
                    map((l: JobAndLogs) => {
                        this.logs.push(...l.logs);
                        this.job = l.job;
                        if (this.job && this.jobHasMoreLogs(this.job)) {
                            this.scheduleJobLogsFetch();
                        }
                    })
                ).subscribe();
            }
        }, 1000);

    }

    unscheduleJobLogsFetch() {
        if (this.timeoutHandler !== null && this.timeoutHandler !== undefined) {
            clearTimeout(this.timeoutHandler);
        }
    }

    jobHasMoreLogs(job: Job): boolean {
        return (job && (job.progress !== 'COMPLETED' && job.progress !== 'FAILED'));
    }
}
