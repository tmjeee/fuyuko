import {Component, OnInit} from '@angular/core';
import {Attribute} from '../../model/attribute.model';
import {PricedItem} from '../../model/item.model';
import {PricingStructure} from '../../model/pricing-structure.model';
import {PartnerService} from '../../service/partner-service/partner.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {User} from '../../model/user.model';
import {concatMap, finalize, map, tap} from 'rxjs/operators';
import {MatSelectChange} from '@angular/material/select';
import {PaginableApiResponse} from "../../model/api-response.model";


@Component({
   templateUrl: './partner-data-thumbnail.page.html',
   styleUrls: ['./partner-data-thumbnail.page.scss']
})
export class PartnerDataThumbnailPageComponent implements OnInit {

   loading: boolean; // loading the data thumbnail
   attributes: Attribute[];
   pricedItems: PricedItem[];

   pricingStructures: PricingStructure[];

   constructor(private partnerService: PartnerService,
               private authService: AuthService,
               private attributeService: AttributeService) {
      this.loading = false;
      this.pricingStructures = [];
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
      if (pricingStructure) {
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

}
