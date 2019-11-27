import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PricingStructure, PricingStructureItemWithPrice, PricingStructureWithItems} from '../../model/pricing-structure.model';
import {PricingStructureEvent, PricingStructureInput} from '../../component/pricing-component/pricing-structure-table.component';
import {PricingStructureService} from '../../service/pricing-structure-service/pricing-structure.service';
import {tap} from 'rxjs/operators';
import {ApiResponse} from "../../model/response.model";


@Component({
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss']
})
export class PricingPageComponent implements OnInit  {

    pricingStructureInput: PricingStructureInput;
    fetchFn: (pricingStructureId: number) => Observable<PricingStructureWithItems>;

    constructor(private pricingStructureService: PricingStructureService) {
        this.pricingStructureInput = {
            pricingStructures: [],
            currentPricingStructure: null
        } as PricingStructureInput;
    }

    ngOnInit(): void {
        this.reload(null);
        this.fetchFn = (pricingStructureId: number) => {
            return this.pricingStructureService.pricingStructureWithItems(pricingStructureId);
        };
    }

    reload(pricingStructure: PricingStructure) {
        this.pricingStructureService.allPricingStructures()
            .pipe(
                tap((pricingStructures: PricingStructure[]) => {
                    this.pricingStructureInput = {
                        pricingStructures,
                        currentPricingStructure: pricingStructure
                    } as PricingStructureInput;
                })
            ).subscribe();
    }

    onPricingStructureTableEvent($event: PricingStructureEvent) {
        switch($event.type) {
            case 'delete-pricing-structure':
                this.pricingStructureService
                    .deletePricingStructure($event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => this.reload(null)))
                    .subscribe();
                break;
            case 'new-pricing-structure':
                this.pricingStructureService
                    .newPricingStructure($event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => this.reload($event.pricingStructure)))
                    .subscribe();
                break;
            case 'edit-pricing-structure':
                this.pricingStructureService
                    .updatePricingStructure($event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => this.reload($event.pricingStructure)))
                    .subscribe();
                break;
            case 'edit-pricing-item':
                this.pricingStructureService
                    .editPricingStructureItem($event.pricingStructure.id, $event.pricingStructureItem)
                    .pipe(tap((r: ApiResponse) => this.reload($event.pricingStructure)))
                    .subscribe();
                break;
        }
    }
}
