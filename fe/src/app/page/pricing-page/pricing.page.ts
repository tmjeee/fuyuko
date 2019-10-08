import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PricingStructure, PricingStructureItemWithPrice, PricingStructureWithItems} from '../../model/pricing-structure.model';
import {PricingStructureEvent, PricingStructureInput} from '../../component/pricing-component/pricing-structure-table.component';
import {PricingStructureService} from '../../service/pricing-structure-service/pricing-structure.service';
import {tap} from 'rxjs/operators';


@Component({
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss']
})
export class PricingPageComponent implements OnInit  {

    pricingStructureInput: PricingStructureInput;
    fetchFn: (pricingStructureId: number) => Observable<PricingStructureWithItems>;

    constructor(private pricingStructureService: PricingStructureService) {}

    ngOnInit(): void {
        this.reload();
        this.fetchFn = (pricingStructureId: number) => {
            return this.pricingStructureService.pricingStructureWithItems(pricingStructureId);
        };
    }

    reload() {
        this.pricingStructureService.allPricingStructures()
            .pipe(
                tap((p: PricingStructure[]) => {
                    this.pricingStructureInput = {
                        pricingStructures: p,
                        currentPricingStructure: null
                    } as PricingStructureInput;
                })
            ).subscribe();
    }

    onPricingStructureTableEvent($event: PricingStructureEvent) {
        switch($event.type) {
            case 'delete-pricing-structure':
                this.pricingStructureService
                    .deletePricingStructure($event.pricingStructure)
                    .pipe(tap((r: PricingStructure) => this.reload()))
                    .subscribe();
                break;
            case 'new-pricing-structure':
                this.pricingStructureService
                    .newPricingStructure($event.pricingStructure)
                    .pipe(tap((r: PricingStructure) => this.reload()))
                    .subscribe();
                break;
            case 'edit-pricing-structure':
                this.pricingStructureService
                    .updatePricingStructure($event.pricingStructure)
                    .pipe(tap((r: PricingStructure) => this.reload()))
                    .subscribe();
                break;
            case 'edit-pricing-item':
                this.pricingStructureService
                    .editPricingStructureItem($event.pricingStructureItem)
                    .pipe(tap((r: PricingStructureItemWithPrice) => this.reload()))
                    .subscribe();
                break;
        }
    }
}
