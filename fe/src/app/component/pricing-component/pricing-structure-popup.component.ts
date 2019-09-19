import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';


@Component({
    templateUrl: './pricing-structure-popup.component.html',
    styleUrls: ['./pricing-structure-popup.component.scss']
})
export class PricingStructurePopupComponent {

    constructor(private matDialogRef: MatDialogRef<PricingStructurePopupComponent>) {}

}
