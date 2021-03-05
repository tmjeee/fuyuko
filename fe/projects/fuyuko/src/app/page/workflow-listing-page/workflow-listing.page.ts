import {Component, OnInit, ViewChild} from '@angular/core';
import {
    CreateWorkflowFn, GetAttributesByViewFn,
    GetWorkflowsByViewFn,
    WorkflowComponent
} from '../../component/workflow-component/workflow.component';
import {WorkflowService} from '../../service/workflow-service/workflow.service';
import {NotificationsService} from 'angular2-notifications';
import {finalize, map, tap} from 'rxjs/operators';
import {toNotifications} from '../../service/common.service';
import {View} from '../../model/view.model';
import {ViewService} from '../../service/view-service/view.service';
import {combineLatest, concat, merge} from 'rxjs';
import {WorkflowDefinition} from '../../model/workflow.model';
import {LoadingService} from '../../service/loading-service/loading.service';
import {Attribute} from '../../model/attribute.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {toLimitOffset} from '../../../../../../../be/src/util/utils';


@Component({
   templateUrl: './workflow-listing.page.html',
   styleUrls: ['./workflow-listing.page.scss']
})
export class WorkflowListingPageComponent implements OnInit {

    constructor(private workflowService: WorkflowService,
                private viewService: ViewService,
                private attributeService: AttributeService,
                private loadingService: LoadingService,
                private notificationService: NotificationsService) { }

    views: View[];
    workflowDefinitions: WorkflowDefinition[];

    @ViewChild('workflowComponent') workflowComponent: WorkflowComponent;

    createWorkflowFn: CreateWorkflowFn = (r) => {
        this.loadingService.startLoading();
        this.workflowService.createWorkflow(
            r.workflowName, r.view.id, r.workflowAction, r.workflowType, r.workflowDefinition.id, r.workflowAttributeIds)
            .pipe(
                tap(apiResponse => {
                    toNotifications(this.notificationService, apiResponse);
                    this.workflowComponent.reload();
                }),
                finalize(() => this.loadingService.stopLoading())
            ).subscribe();
    }

    getWorkflowsByViewFn: GetWorkflowsByViewFn = view => {
        this.loadingService.startLoading();
        return this.workflowService.getWorkflowsByView(view.id)
            .pipe(
                tap(apiResponse => {
                    // toNotifications(this.notificationService, apiResponse);
                }),
                map(apiResponse => apiResponse.payload),
                finalize(() => this.loadingService.stopLoading())
            );
    }

    getAttributesByViewFn: GetAttributesByViewFn = view => {
        this.loadingService.stopLoading();
        return this.attributeService.getAllAttributesByView(view.id, { offset: 0, limit: Number.MAX_SAFE_INTEGER })
            .pipe(
               map(paginableApiResponse => paginableApiResponse.payload),
               finalize(() => this.loadingService.stopLoading())
            );
    }

    ngOnInit(): void {
        this.loadingService.startLoading();
        combineLatest([
            this.viewService.getAllViews(),
            this.workflowService.getAllWorkflowDefinitions(),
        ]).pipe(
            tap(r => {
                this.views = r[0];
                this.workflowDefinitions = r[1];
            }),
            finalize(() => this.loadingService.stopLoading())
        ).subscribe();
    }
}
