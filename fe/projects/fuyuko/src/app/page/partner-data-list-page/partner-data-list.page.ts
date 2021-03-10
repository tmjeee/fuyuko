import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSelectChange} from '@angular/material/select';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {concatMap, finalize, map, tap} from 'rxjs/operators';
import {PricedItem} from '@fuyuko-common/model/item.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {PartnerService} from '../../service/partner-service/partner.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {User} from '@fuyuko-common/model/user.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {LoadingService} from '../../service/loading-service/loading.service';

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
                private attributeService: AttributeService,
                private loadingService: LoadingService) {
        this.loading = false;
    }

    toggleSideNav($event: MouseEvent) {
        this.sideNav.toggle();
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
