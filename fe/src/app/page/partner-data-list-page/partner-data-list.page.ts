import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSelectChange} from '@angular/material/select';
import {PricingStructure} from '../../model/pricing-structure.model';
import {concatMap, finalize, map, tap} from 'rxjs/operators';
import {PricedItem, TablePricedItem} from '../../model/item.model';
import {toTablePricedItem} from '../../utils/item-to-table-items.util';
import {Attribute} from '../../model/attribute.model';
import {PartnerService} from '../../service/partner-service/partner.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {User} from '../../model/user.model';
import {PaginableApiResponse} from "../../model/api-response.model";

@Component({
    templateUrl: './partner-data-list.page.html',
    styleUrls: ['./partner-data-list.page.scss']
})
export class PartnerDataListPageComponent implements OnInit {

    @ViewChild('sideNav', { static: true }) sideNav: MatSidenav;

    loading: boolean; // loading the data list
    attributes: Attribute[];
    pricedItems: PricedItem[];

    pricingStructures: PricingStructure[];

    constructor(private partnerService: PartnerService,
                private authService: AuthService,
                private attributeService: AttributeService) {
        this.loading = false;
    }

    toggleSideNav($event: MouseEvent) {
        this.sideNav.toggle();
    }

    ngOnInit(): void {
        const myself: User = this.authService.myself();
        this.partnerService.getPartnerPricingStructures(myself.id)
            .pipe(
                tap((ps: PricingStructure[]) => {
                    this.pricingStructures = ps;
                })
            ).subscribe();
    }


    onPricingStructureSelectionChanged($event: MatSelectChange) {
        const pricingStructure: PricingStructure = $event.value;
        this.loading = true;
        this.partnerService.getPartnerPriceItems(pricingStructure.id).pipe(
            tap((i: PricedItem[]) => {
                this.pricedItems = i;
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
            })
        ).subscribe();
    }
}
