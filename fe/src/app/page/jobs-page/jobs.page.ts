import {Component, OnInit} from '@angular/core';
import {Job, JobAndLogs, JobLog} from '../../model/job.model';
import {Observable} from 'rxjs';
import {JobsService} from '../../service/jobs-service/jobs.service';
import {map, tap} from 'rxjs/operators';

@Component({
    templateUrl: './jobs.page.html',
    styleUrls: ['./jobs.page.scss']
})
export class JobsPageComponent implements OnInit {
    jobs: Job[];
    fetchFn: (jobId: number, lastLogId: number) => Observable<JobAndLogs>;

    constructor(private jobService: JobsService) {
    }

    ngOnInit(): void {
        this.fetchFn = this.f.bind(this);
        this.jobService.allJobs()
            .pipe(
                map((jobs: Job[]) => {
                    this.jobs = jobs;
                })
            ).subscribe();
    }

    f(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        return this.jobService.jobLogs(jobId, lastLogId);
    }



}
