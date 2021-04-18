import {Component, OnInit} from '@angular/core';
import {WorkflowDefinition} from '@fuyuko-common/model/workflow.model';
import {WorkflowService} from '../../service/workflow-service/workflow.service';
import {finalize, tap} from 'rxjs/operators';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
   templateUrl: './workflow-definition-listing.page.html',
   styleUrls: ['./workflow-definition-listing.page.scss']
})
export class WorkflowDefinitionListingPageComponent implements OnInit {
    workflowDefinitions: WorkflowDefinition[];

    constructor(private workflowService: WorkflowService,
                private loadingService: LoadingService) { }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.loadingService.startLoading();
        this.workflowService.getAllWorkflowDefinitions()
            .pipe(
                tap((workflowDefinitions: WorkflowDefinition[]) => {
                   this.workflowDefinitions = workflowDefinitions;
                }),
                finalize(() => this.loadingService.stopLoading())
            ).subscribe();
    }



}
