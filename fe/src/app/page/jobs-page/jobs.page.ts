import {Component, OnInit} from '@angular/core';
import {Job, JobAndLogs, JobLog} from '../../model/job.model';
import {Observable} from 'rxjs';
import {JobsService} from '../../service/jobs-service/jobs.service';
import {finalize, map, tap} from 'rxjs/operators';

@Component({
    templateUrl: './jobs.page.html',
    styleUrls: ['./jobs.page.scss']
})
export class JobsPageComponent implements OnInit {
    ready: boolean;
    jobs: Job[];
    fetchFn: (jobId: number, lastLogId: number) => Observable<JobAndLogs>;

    constructor(private jobService: JobsService) {
    }

    ngOnInit(): void {
        this.ready = false;
        this.fetchFn = this.f.bind(this);
        this.jobService.allJobs()
            .pipe(
                map((jobs: Job[]) => {
                    this.jobs = jobs;
                    this.ready = true;
                }),
                finalize(() => this.ready = false)
            ).subscribe();
    }

    f(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        return this.jobService.jobLogs(jobId, lastLogId);
    }



}
