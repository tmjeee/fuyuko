import {Component, Input} from '@angular/core';
import {Job, JobAndLogs} from '@fuyuko-common/model/job.model';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-jobs-listings',
    templateUrl: './jobs-listings.component.html',
    styleUrls: ['./jobs-listings.component.scss']
})
export class JobsListingsComponent {

    @Input() jobs: Job[];
    @Input() fetchFn: (jobId: number, lastLogId: number) => Observable<JobAndLogs>;
    fetchJobs: {[k: number]: boolean} = {};

    onExpansionPanelClosed(job: Job) {
        this.fetchJobs[job.id] = false;
    }

    onExpansionPanelOpened(job: Job) {
        this.fetchJobs[job.id] = true;
    }

    fetch(job: Job) {
        return this.fetchJobs[job.id];
    }
}
