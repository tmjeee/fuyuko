import {Component, OnInit} from '@angular/core';
import {PartnerService} from '../../service/partner-service/partner.service';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {concatMap, finalize, map, tap} from 'rxjs/operators';
import {User} from '@fuyuko-common/model/user.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {AuthService} from '../../service/auth-service/auth.service';
import {MatSelectChange} from '@angular/material/select';
import {PricedItem, TablePricedItem} from '@fuyuko-common/model/item.model';
import {toTablePricedItem} from '../../utils/item-to-table-items.util';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
    templateUrl: './partner-data-table.page.html',
    styleUrls: ['./partner-data-table.page.scss']
})
export class PartnerDataTablePageComponent implements OnInit {

    loading: boolean; // loading the data table
    attributes: Attribute[];
    pricedItems: PricedItem[];
    tablePricedItems: TablePricedItem[];

    pricingStructures: PricingStructure[];

    constructor(private partnerService: PartnerService,
                private authService: AuthService,
                private attributeService: AttributeService,
                private loadingService: LoadingService) {
        this.loading = false;
        this.pricingStructures = [];
    }

    ngOnInit(): void {
        const myself: User = this.authService.myself();
        this.loadingService.startLoading();
        this.partnerService.getPartnerPricingStructures(myself.id)
            .pipe(
                tap((ps: PricingStructure[]) => {
                    this.pricingStructures = ps;
                }),
                finalize(() => {
                    this.loadingService.stopLoading();
                })
            ).subscribe();
    }


    onPricingStructureSelectionChanged($event: MatSelectChange) {
        const pricingStructure: PricingStructure = $event.value;
        if (pricingStructure) {
            this.loading = true;
            this.loadingService.startLoading();
            this.partnerService.getPartnerPriceItems(pricingStructure.id).pipe(
                tap((i: PricedItem[]) => {
                    this.pricedItems = i;
                    this.tablePricedItems = toTablePricedItem(this.pricedItems);
                }),
                concatMap((_) => {
                    return this.attributeService.getAllAttributesByView(pricingStructure.viewId)
                        .pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload));
                }),
                tap((a: Attribute[]) => {
                    this.attributes = a;
                }),
                finalize(() => {
                    this.loading = false;
                    this.loadingService.stopLoading();
                })
            ).subscribe();
        }
    }
}
