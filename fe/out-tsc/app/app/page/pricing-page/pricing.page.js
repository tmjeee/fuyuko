import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { PricingStructureService } from '../../service/pricing-structure-service/pricing-structure.service';
import { tap } from 'rxjs/operators';
import { toNotifications } from '../../service/common.service';
import { NotificationsService } from 'angular2-notifications';
let PricingPageComponent = class PricingPageComponent {
    constructor(pricingStructureService, notificationService) {
        this.pricingStructureService = pricingStructureService;
        this.notificationService = notificationService;
        this.pricingStructureInput = {
            pricingStructures: [],
            currentPricingStructure: null
        };
    }
    ngOnInit() {
        this.reload(null);
        this.fetchFn = (pricingStructureId) => {
            return this.pricingStructureService.pricingStructureWithItems(pricingStructureId);
        };
    }
    reload(pricingStructure) {
        this.pricingStructureService.allPricingStructures()
            .pipe(tap((pricingStructures) => {
            this.pricingStructureInput = {
                pricingStructures,
                currentPricingStructure: pricingStructure
            };
        })).subscribe();
    }
    onPricingStructureTableEvent($event) {
        switch ($event.type) {
            case 'delete-pricing-structure':
                this.pricingStructureService
                    .deletePricingStructure($event.pricingStructure)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload(null);
                }))
                    .subscribe();
                break;
            case 'new-pricing-structure':
                this.pricingStructureService
                    .newPricingStructure($event.pricingStructure)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload($event.pricingStructure);
                }))
                    .subscribe();
                break;
            case 'edit-pricing-structure':
                this.pricingStructureService
                    .updatePricingStructure($event.pricingStructure)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload($event.pricingStructure);
                }))
                    .subscribe();
                break;
            case 'edit-pricing-item':
                this.pricingStructureService
                    .editPricingStructureItem($event.pricingStructure.id, $event.pricingStructureItem)
                    .pipe(tap((r) => {
                    toNotifications(this.notificationService, r);
                    this.reload($event.pricingStructure);
                }))
                    .subscribe();
                break;
        }
    }
};
PricingPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './pricing.page.html',
        styleUrls: ['./pricing.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [PricingStructureService,
        NotificationsService])
], PricingPageComponent);
export { PricingPageComponent };
//# sourceMappingURL=pricing.page.js.map