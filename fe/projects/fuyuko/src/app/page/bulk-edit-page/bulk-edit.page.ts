import {Component, OnDestroy, OnInit} from '@angular/core';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, map, tap} from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import {Observable, Subscription} from 'rxjs';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {
    BulkEditWizardComponentEvent,
    GetJobLogsFn,
    GetPreviewFn, ScheduleBulkEditJobFn
} from '../../component/bulk-edit-wizard-component/bulk-edit-wizard.component';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {BulkEditPackage} from '@fuyuko-common/model/bulk-edit.model';
import {JobAndLogs} from '@fuyuko-common/model/job.model';
import {JobsService} from '../../service/jobs-service/jobs.service';
import {BulkEditService} from '../../service/bulk-edit-service/bulk-edit.service';
import {NotificationsService} from 'angular2-notifications';
import {LoadingService} from '../../service/loading-service/loading.service';
import {assertDefinedReturn} from '../../utils/common.util';


@Component({
  templateUrl: './bulk-edit.page.html',
  styleUrls: ['./bulk-edit.page.scss']
})
export class BulkEditPageComponent implements OnInit, OnDestroy {

  attributes: Attribute[] = [];
  allViews: View[] = [];

  currentView?: View;
  subscription?: Subscription;
  getJobLogsFn!: GetJobLogsFn;
  getPreviewFn!: GetPreviewFn;
  scheduleBulkEditJobFn!: ScheduleBulkEditJobFn;


  constructor(private viewService: ViewService,
              private jobsService: JobsService,
              private bulkEditService: BulkEditService,
              private notificationsService: NotificationsService,
              private attributeService: AttributeService,
              private loadingService: LoadingService) {}

  ngOnInit(): void {
      this.getJobLogsFn = (jobId: number, lastLogId: number): Observable<JobAndLogs> => {
          this.loadingService.startLoading();
          return this.jobsService.jobLogs(jobId, lastLogId).pipe(
              finalize(() => this.loadingService.stopLoading())
          );
      };
      this.getPreviewFn = (view: View, changeClauses: ItemValueAndAttribute[],
                           whereClauses: ItemValueOperatorAndAttribute[]): Observable<BulkEditPackage> => {
          this.loadingService.startLoading();
          return this.bulkEditService.previewBuilEdit(view.id, changeClauses, whereClauses).pipe(
              finalize(() => this.loadingService.stopLoading()));
      };
      this.scheduleBulkEditJobFn = (view: View, bulkEditPackage: BulkEditPackage) => {
          this.loadingService.startLoading();
          return this.jobsService.scheduleBulkEditJob(view.id, bulkEditPackage).pipe(
              finalize(() => this.loadingService.stopLoading()));
      };
      this.loadingService.startLoading();
      this.viewService.getAllViews()
          .pipe(
            map((v: View[]) => {
                this.allViews = v;
            }),
            map(() => {
                this.subscription = this.viewService.asObserver()
                    .pipe(
                        map((v: View | undefined) => {
                            if (v) {
                                this.loadingService.startLoading();
                                this.currentView = this.allViews ? this.allViews.find((vv: View) => vv.id === v.id) : undefined;
                                this.subscription = this.attributeService.getAllAttributesByView(v.id)
                                    .pipe(
                                        map((r: PaginableApiResponse<Attribute[]>) => assertDefinedReturn(r.payload)),
                                        map((a: Attribute[]) => {
                                            this.attributes = a;
                                        }),
                                        finalize(() => {
                                            this.loadingService.stopLoading();
                                        })
                                    ).subscribe();
                            }
                        }),
                    ).subscribe();
            }),
            finalize(() => {
                this.loadingService.stopLoading();
            })
          ).subscribe();
  }

    onViewSelectionChanged($event: MatSelectChange) {
        const view: View = $event.value;
        this.viewService.setCurrentView(view);
    }

    ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription .unsubscribe();
      }
    }

    onBulkEditWizardEvent($event: BulkEditWizardComponentEvent) {
      switch ($event.type) {
          case 'error': {
              this.notificationsService.error('Error', $event.message);
              break;
          }
      }
    }
}
