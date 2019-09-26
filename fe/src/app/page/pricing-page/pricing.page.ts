import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PricingStructure, PricingStructureWithItems} from '../../model/pricing-structure.model';
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
        this.pricingStructureService.allPricingStructures()
            .pipe(
                tap((p: PricingStructure[]) => {
                    this.pricingStructureInput = {
                        pricingStructures: p,
                        currentPricingStructure: null
                    } as PricingStructureInput;
                })
            ).subscribe();
        this.fetchFn = (pricingStructureId: number) => {
            return this.pricingStructureService.pricingStructureWithItems(pricingStructureId);
        };
    }

    onPricingStructureTableEvent($event: PricingStructureEvent) {
        switch($event.type) {
            case 'delete-pricing-item':
                break;
            case 'delete-pricing-structure':
                break;
            case 'new-pricing-structure':
                break;
            case 'edit-pricing-item':
                break;
            case 'edit-pricing-structure':
                break;
        }
    }
}
