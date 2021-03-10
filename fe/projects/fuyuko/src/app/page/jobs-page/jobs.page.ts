import {Component, OnInit} from '@angular/core';
import {Job, JobAndLogs} from '@fuyuko-common/model/job.model';
import {Observable} from 'rxjs';
import {JobsService} from '../../service/jobs-service/jobs.service';
import {finalize, map} from 'rxjs/operators';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
    templateUrl: './jobs.page.html',
    styleUrls: ['./jobs.page.scss']
})
export class JobsPageComponent implements OnInit {
    ready: boolean;
    jobs: Job[];
    fetchFn: (jobId: number, lastLogId: number) => Observable<JobAndLogs>;

    constructor(private jobService: JobsService,
                private loadingService: LoadingService) {
    }

    ngOnInit(): void {
        this.ready = false;
        this.loadingService.startLoading();
        this.fetchFn = this.f.bind(this);
        this.jobService.allJobs()
            .pipe(
                map((jobs: Job[]) => {
                    this.jobs = jobs;
                    this.ready = true;
                }),
                finalize(() => {
                    this.ready = true;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
    }

    f(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        return this.jobService.jobLogs(jobId, lastLogId);
    }



}
