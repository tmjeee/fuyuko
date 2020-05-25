import {PricingStructurePage} from "./sub-page-object/pricing-structure.page";

export class PricingPage {

    constructor() { }

    visit(): PricingPage {
        return this;
    }

    visitPricingStructurePage(): PricingStructurePage {
        return new PricingStructurePage().visit();
    }
}
