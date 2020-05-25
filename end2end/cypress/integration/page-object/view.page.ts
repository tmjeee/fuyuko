import {ViewRulePage} from "./sub-page-object/view-rule.page";
import {ViewAttributePage} from "./sub-page-object/view-attribute.page";
import {ViewAttributeDetailsPage} from "./sub-page-object/view-attribute-details.page";
import {ViewDataTablePage} from "./sub-page-object/view-data-table.page";
import {ViewDataThumbnailPage} from "./sub-page-object/view-data-thumbnail.page";
import {ViewDataListPage} from "./sub-page-object/view-data-list.page";
import {ViewValidationPage} from "./sub-page-object/view-validation.page";
import {ViewValidationDetailsPage} from "./sub-page-object/view-validation-details.page";
import {ViewViewPage} from "./sub-page-object/view-view.page";


export class ViewPage  {

    visit(): ViewPage {
        // cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        // new ViewRulePage().visit();
        return this;
    }

    visitViewRule(): ViewRulePage {
        // cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return new ViewRulePage().visit();
    }

    visitViewAttributes(): ViewAttributePage {
        // cy.visit(`/view-gen-layout/(attributes//help:view-help)`);
        return new ViewAttributePage().visit();
    }

    visitViewAttributeWithId(attributeId: number): ViewAttributeDetailsPage {
        // cy.visit(`/view-gen-layout/(attribute/${attributeId}//help:view-help)`);
        return new ViewAttributeDetailsPage(attributeId).visit();
    }

    visitViewDataTable(): ViewDataTablePage {
        // cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        return new ViewDataTablePage().visit();
    }

    visitViewDataThumbnail(): ViewDataThumbnailPage {
        // cy.visit(`/view-gen-layout/(data-thumbnail//help:view-help)`);
        return new ViewDataThumbnailPage().visit();
    }

    visitViewDataList(): ViewDataListPage {
        // cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        return new ViewDataListPage().visit();
    }

    visitViews(): ViewViewPage {
        // cy.visit(`/view-gen-layout/(views//help:view-help)`);
        return new ViewViewPage().visit();
    }

    visitValidations(): ViewValidationPage {
        // cy.visit(`/view-gen-layout/(validation//help:view-help)`);
        return new ViewValidationPage().visit();
    }

    visitValidationDetails(validationName: string): ViewValidationDetailsPage {
        return new ViewValidationDetailsPage(validationName).visit();
    }
}
