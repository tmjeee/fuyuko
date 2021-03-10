import {Component, OnInit} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {PricingStructure, PricingStructureWithItems} from '@fuyuko-common/model/pricing-structure.model';
import {PricingStructureEvent, PricingStructureInput} from '../../component/pricing-component/pricing-structure-table.component';
import {PricingStructureService} from '../../service/pricing-structure-service/pricing-structure.service';
import {finalize, tap} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {View} from '@fuyuko-common/model/view.model';
import {ViewService} from '../../service/view-service/view.service';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
  templateUrl: './pricing-structure.page.html',
  styleUrls: ['./pricing-structure.page.scss']
})
export class PricingStructurePageComponent implements OnInit  {

    loading: boolean;
    views: View[];
    pricingStructureInput: PricingStructureInput;
    fetchFn: (pricingStructureId: number, limitOffset?: LimitOffset) => Observable<PricingStructureWithItems>;

    constructor(private pricingStructureService: PricingStructureService,
                private router: Router,
                private viewService: ViewService,
                private loadingService: LoadingService,
                private notificationService: NotificationsService) {
        this.pricingStructureInput = {
            pricingStructures: [],
            currentPricingStructure: null
        } as PricingStructureInput;
    }

    ngOnInit(): void {
        this.reload(null);
        this.fetchFn = (pricingStructureId: number, limitOffset?: LimitOffset): Observable<PricingStructureWithItems> => {
            this.loadingService.startLoading();
            return this.pricingStructureService.pricingStructureWithItems(pricingStructureId, limitOffset).pipe(
                finalize(() => this.loadingService.stopLoading())
            );
        };
    }

    reload(pricingStructure: PricingStructure) {
        this.loading = true;
        this.loadingService.startLoading();
        forkJoin([
            this.viewService.getAllViews(),
            this.pricingStructureService.allPricingStructures()
        ]).pipe(
            tap((r: [View[], PricingStructure[]]) => {
                // r[0]
                this.views = r[0];

                // r[1]
                this.pricingStructureInput = {
                    pricingStructures:  r[1],
                    currentPricingStructure: pricingStructure
                } as PricingStructureInput;

            }),
            finalize(() => {
               this.loading = false;
               this.loadingService.stopLoading();
            })
        ).subscribe();
    }

    onPricingStructureTableEvent($event: PricingStructureEvent) {
        switch ($event.type) {
            case 'delete-pricing-structure':
                this.pricingStructureService
                    .deletePricingStructure($event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => {
                        toNotifications(this.notificationService, r);
                        this.reload(null);
                    }))
                    .subscribe();
                break;
            case 'new-pricing-structure':
                this.pricingStructureService
                    .newPricingStructure($event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => {
                        toNotifications(this.notificationService, r);
                        this.reload($event.pricingStructure);
                    }))
                    .subscribe();
                break;
            case 'edit-pricing-structure':
                this.pricingStructureService
                    .updatePricingStructure($event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => {
                        toNotifications(this.notificationService, r);
                        this.reload($event.pricingStructure);
                    }))
                    .subscribe();
                break;
            case 'edit-pricing-item':
                this.pricingStructureService
                    .editPricingStructureItem($event.pricingStructure.id, $event.pricingStructureItem)
                    .pipe(tap((r: ApiResponse) => {
                        toNotifications(this.notificationService, r);
                        this.reload($event.pricingStructure);
                    }))
                    .subscribe();
                break;
        }
    }
}
