import {Component, OnInit} from '@angular/core';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {PricedItem} from '@fuyuko-common/model/item.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {PartnerService} from '../../service/partner-service/partner.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {User} from '@fuyuko-common/model/user.model';
import {concatMap, finalize, map, tap} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material/select';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
   templateUrl: './partner-data-thumbnail.page.html',
   styleUrls: ['./partner-data-thumbnail.page.scss']
})
export class PartnerDataThumbnailPageComponent implements OnInit {

   loading = true; // loading the data thumbnail
   attributes: Attribute[] = [];
   pricedItems: PricedItem[] = [];

   pricingStructures: PricingStructure[];

   constructor(private partnerService: PartnerService,
               private authService: AuthService,
               private attributeService: AttributeService,
               private loadingService: LoadingService) {
      this.loading = false;
      this.pricingStructures = [];
   }

   ngOnInit(): void {
      const myself: User | undefined = this.authService.myself();
      if (myself) {
          this.partnerService.getPartnerPricingStructures(myself.id)
              .pipe(
                  tap((ps: PricingStructure[]) => {
                      this.pricingStructures = ps;
                  })
              ).subscribe();
      }
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
                      .pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload ?? []));
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
