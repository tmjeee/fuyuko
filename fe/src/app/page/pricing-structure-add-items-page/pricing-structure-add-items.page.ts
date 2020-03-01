import {Component, OnInit} from "@angular/core";
import {PricingStructure, PricingStructureItem} from "../../model/pricing-structure.model";
import {ActivatedRoute} from "@angular/router";
import {PricingStructureService} from "../../service/pricing-structure-service/pricing-structure.service";
import {forkJoin} from "rxjs";
import {finalize, tap} from "rxjs/operators";
import {PricingStructureAddItemsComponentEvent} from "../../component/pricing-component/pricing-structure-add-items.component";


@Component({
    templateUrl: './pricing-structure-add-items.page.html',
    styleUrls: ['./pricing-structure-add-items.page.scss']
})
export class PricingStructureAddItemsPageComponent implements OnInit{

    loading: boolean;

    pricingStructure: PricingStructure;
    addablePricingStructureItems: PricingStructureItem[];

    constructor(private activatedRoute: ActivatedRoute,
                private pricingStructureService: PricingStructureService) {
    }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.loading = true;
        const pricingStructureId: number = Number(this.activatedRoute.snapshot.params.pricingStructureId);
        forkJoin([
            this.pricingStructureService.getPricingStructureById(pricingStructureId),
            this.pricingStructureService.allAddablePricingStructureItems(pricingStructureId)
        ]).pipe(
            tap((r: [PricingStructure, PricingStructureItem[]]) => {
                this.pricingStructure = r[0];
                this.addablePricingStructureItems = r[1];
            }),
            finalize(() => {
                this.loading = false;
            })
        ).subscribe();
    }

    onAddPricingStructureAddItemsChange($event: PricingStructureAddItemsComponentEvent) {
        switch($event.type) {
            case "add":
                this.pricingStructureService.addPricingStructureItems($event.pricingStructure.id, $event.pricingStructureItems)
                    .pipe(
                        tap((_) => {
                            this.reload();
                        })
                    ).subscribe();
                break;
        }
    }
}