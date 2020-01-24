import {AbstractPage} from "./abstract.page";
import {ViewRulePage} from "./sub-page-object/view-rule.page";
import {ViewRuleDetailsPage} from "./sub-page-object/view-rule-details.page";
import {ViewAttributePage} from "./sub-page-object/view-attribute.page";
import {ViewAttributeDetailsPage} from "./sub-page-object/view-attribute-details.page";
import {ViewDataTablePage} from "./sub-page-object/view-data-table.page";
import {ViewDataThumbnailPage} from "./sub-page-object/view-data-thumbnail.page";
import {ViewDataListPage} from "./sub-page-object/view-data-list.page";
import {ViewValidationPage} from "./sub-page-object/view-validation.page";
import {ViewValidationDetailsPage} from "./sub-page-object/view-validation-details.page";
import {ViewViewPage} from "./sub-page-object/view-view.page";


export class ViewPage extends AbstractPage {

    visit(): ViewRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return new ViewRulePage();
    }

    visitViewRule(): ViewRulePage {
        cy.visit(`/view-gen-layout/(rules//help:view-help)`);
        return new ViewRulePage();
    }

    visitViewRuleWithId(ruleId: number) {
        cy.visit(`/view-gen-layout/(rule/${ruleId}//help:view-help)`);
        return new ViewRuleDetailsPage(ruleId);
    }

    visitViewAttributes() {
        cy.visit(`/view-gen-layout/(attributes//help:view-help)`);
        return new ViewAttributePage();
    }

    visitViewAttributeWithId(attributeId: number) {
        cy.visit(`/view-gen-layout/(attribute/${attributeId}//help:view-help)`);
        return new ViewAttributeDetailsPage(attributeId);
    }

    visitViewDataTable() {
        cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        return new ViewDataTablePage();
    }

    visitViewDataThumbnail() {
        cy.visit(`/view-gen-layout/(data-thumbnail//help:view-help)`);
        return new ViewDataThumbnailPage();
    }

    visitViewDataList() {
        cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        return new ViewDataListPage();
    }

    visitViews() {
        cy.visit(`/view-gen-layout/(views//help:view-help)`);
        return new ViewViewPage();
    }

    visitValidations() {
        cy.visit(`/view-gen-layout/(validation//help:view-help)`);
        return new ViewValidationPage();
    }

    visitValidationDetails(viewId: number, validationId: number) {
        cy.visit(`/view-gen-layout/(validation-details/view/${viewId}/validation/${validationId}//help:view-help)`);
        return new ViewValidationDetailsPage(viewId, validationId);
    }
}
