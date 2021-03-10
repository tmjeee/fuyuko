import {Component, OnInit, OnDestroy} from '@angular/core';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {FormBuilder} from '@angular/forms';
import {finalize, map, switchMap, tap} from 'rxjs/operators';
import {View} from '@fuyuko-common/model/view.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, Subscription} from 'rxjs';
import {ViewService} from '../../service/view-service/view.service';
import {NotificationsService} from 'angular2-notifications';
import {EditAttributeComponentEvent} from '../../component/attribute-table-component/edit-attribute.component';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {LoadingService} from '../../service/loading-service/loading.service';
import {WorkflowService} from '../../service/workflow-service/workflow.service';
import {Workflow} from '@fuyuko-common/model/workflow.model';

@Component({
    templateUrl: './edit-attribute.page.html',
    styleUrls: ['./edit-attribute.page.scss']
})
export class EditAttributePageComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    currentView: View;
    attribute: Attribute;

    viewLoading: boolean;
    attributeLoading: boolean;

    workflows: Workflow[] = [];  // workflows for edit attributes (if active and available)

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private viewService: ViewService,
                private notificationService: NotificationsService,
                private workflowService: WorkflowService,
                private attributeService: AttributeService,
                private loadingService: LoadingService) {
    }



    ngOnInit(): void {
        this.viewLoading = true;
        this.loadingService.startLoading();
        this.subscription = this.viewService
            .asObserver()
            .pipe(
                map((v: View) => {
                    if (v) {
                        console.log('****************** view', v);
                        this.currentView = v;
                        this.reload();
                        return v;
                    }
                    return undefined;
                }),
                switchMap((x, _) => {
                    if (x /* view */) {
                        console.log('**************** switchmap', x);
                        return this.workflowService.getWorkflowsByViewActionAndType(x.id, 'Edit', 'Attribute');
                    }
                    console.log('****************** switchmap failed');
                    return of(undefined);
                }),
                tap((g: ApiResponse<Workflow[]> | undefined) => {
                    console.log('*************** tap', g);
                    if (g) {
                        this.workflows = g.payload;
                    }
                    this.viewLoading = false;
                    this.loadingService.stopLoading();
                }),
            ).subscribe();
    }


    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async onEditAttributeEvent($event: EditAttributeComponentEvent) {
        switch ($event.type) {
            case 'update':
                this.attributeService.updateAttribute(this.currentView, $event.attribute).pipe(
                    tap((_: ApiResponse) => {
                        toNotifications(this.notificationService, _);
                        this.reload();
                    })
                ).subscribe();
                break;
            case 'cancel':
                await this.router.navigate(['/view-layout', {outlets: {primary: ['attributes'], help: ['view-help'] }}]);
                break;
        }
    }

    reload() {
        const attributeId: string = this.route.snapshot.paramMap.get('attributeId');
        this.attributeLoading = true;
        this.loadingService.startLoading();
        this.attributeService.getAttributeByView(this.currentView.id, Number(attributeId)).pipe(
            tap((a: Attribute) => {
                this.attribute = a;
                this.attributeLoading = false;
            }),
            finalize(() => {
                this.attributeLoading = false;
                this.loadingService.stopLoading();
            })
        ).subscribe();
    }
}
