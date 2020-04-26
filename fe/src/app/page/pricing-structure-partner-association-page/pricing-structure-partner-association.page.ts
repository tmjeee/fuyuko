import {Component, OnInit} from "@angular/core";


@Component({
    templateUrl: './pricing-structure-partner-association.page.html',
    styleUrls: ['./pricing-structure-partner-association.page.scss']
})
export class PricingStructurePartnerAssociationPageComponent implements OnInit {

    loading: boolean;

    ngOnInit(): void {
        this.loading = false;
    }

}