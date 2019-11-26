import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {PricingStructure, PricingStructureItemWithPrice, PricingStructureWithItems} from '../../model/pricing-structure.model';
import {PricingStructureEvent, PricingStructureInput} from '../../component/pricing-component/pricing-structure-table.component';
import {PricingStructureService} from '../../service/pricing-structure-service/pricing-structure.service';
import {finalize, tap} from 'rxjs/operators';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {ApiResponse} from '../../model/response.model';


@Component({
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss']
})
export class PricingPageComponent implements OnInit, OnDestroy  {

    loading: boolean;
    currentView: View;
    subscription: Subscription;
    pricingStructureInput: PricingStructureInput;
    fetchFn: (pricingStructureId: number) => Observable<PricingStructureWithItems>;

    constructor(private pricingStructureService: PricingStructureService,
                private viewService: ViewService) {
        this.pricingStructureInput = {
           pricingStructures: [],
           currentPricingStructure: null
        } as PricingStructureInput;
    }
    ngOnInit(): void {
        this.loading = true;
        console.log('****************** price page init');
        this.subscription = this.viewService.asObserver().pipe(
            tap((r: View) => {
               console.log('&&&&&&&&&&&&&&&&&&&&&&&& got view', r);
               this.currentView = r;
               if (this.currentView) {
                   this.reload(null);
                   this.fetchFn = (pricingStructureId: number) => {
                       const o: Observable<PricingStructureWithItems> =
                           this.pricingStructureService.pricingStructureWithItems(this.currentView.id, pricingStructureId);
                       return o;
                   };
               }
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload(pricingStructure: PricingStructure) {
        this.loading = true;
        console.log('(******** reload ');
        this.pricingStructureService.allPricingStructures(this.currentView.id)
            .pipe(
                tap((pricingStructures: PricingStructure[]) => {
                    this.pricingStructureInput = {
                        pricingStructures,
                        currentPricingStructure: pricingStructure
                    } as PricingStructureInput;
                }),
                finalize(() => {
                    console.log('******* reload done', this.pricingStructureInput);
                    this.loading = false;
                })
            ).subscribe();
    }

    onPricingStructureTableEvent($event: PricingStructureEvent) {
        switch ($event.type) {
            case 'delete-pricing-structure':
                this.pricingStructureService
                    .deletePricingStructure(this.currentView.id, $event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => this.reload(null)))
                    .subscribe();
                break;
            case 'new-pricing-structure':
                this.pricingStructureService
                    .newPricingStructure(this.currentView.id, $event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => this.reload($event.pricingStructure)))
                    .subscribe();
                break;
            case 'edit-pricing-structure':
                this.pricingStructureService
                    .updatePricingStructure(this.currentView.id, $event.pricingStructure)
                    .pipe(tap((r: ApiResponse) => this.reload($event.pricingStructure)))
                    .subscribe();
                break;
            case 'edit-pricing-item':
                this.pricingStructureService
                    .editPricingStructureItem(this.currentView.id, $event.pricingStructure.id, $event.pricingStructureItem)
                    .pipe(tap((r: ApiResponse) => this.reload($event.pricingStructure)))
                    .subscribe();
                break;
        }
    }
}
