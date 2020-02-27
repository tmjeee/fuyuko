import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewValidationPage} from "./view-validation.page";
import {ViewValidationAttributePopupPage} from "./sub-sub-page-object/view-validation-attribute-popup.page";
import {ViewValidationItemPopupPage} from "./sub-sub-page-object/view-validation-item-popup.page";

export class ViewValidationDetailsPage implements ActualPage<ViewValidationDetailsPage> {

    constructor(private validationName: string){ }

    validateTitle(): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-validation-details');
        return this;
    }

    visit(): ViewValidationDetailsPage {
        // cy.visit(`/view-gen-layout/(validation-details/view/${this.viewId}/validation/${this.validationId}//help:view-help)`);
        new ViewValidationPage()
            .visit()
            .clickOnValidationDetails(this.validationName);
        return this;
    }

    verifyErrorMessageExists(): ViewValidationDetailsPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewValidationDetailsPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    clickTab(tabType: 'results' | 'logs'): ViewValidationDetailsPage {
        cy.get(`[test-mat-tab='${tabType}']`).click({force: true});
        return this;
    }

    verifyTab(tabType: 'results' | 'logs'): ViewValidationDetailsPage {
        cy.get(`[test-mat-tab-content='${tabType}']`).should('be.visible');
        return this;
    }


    checkItemRadioButton(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).then((_) => {
            const l = _.find(`[test-mat-radio-item='${itemName}'].mat-radio-checked`).length;
            if (l <= 0) { // not already checked, let's check it
                cy.get(`[test-mat-radio-item='${itemName}'] label`).click({force: true});
            }
        });
        return this;
    }

    uncheckItemRadioButton(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).then((_) => {
            const l = _.find(`[test-mat-radio-item='${itemName}'].mat-radio-checked`).length;
            if (l > 0) { // already checked, let's uncheck it
                cy.get(`[test-mat-radio-item='${itemName}'] label`).click({force: true});
            }
        });
        return this;
    }


    openTableFilterPanel() {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const visible = _.find(`[test-filtering-panel]`).is(':visible');
            if (!visible) { // not visible yet, open filtering panel
                cy.get(`[test-validation-result-table]`)
                    .find(`[test-button-filter]`)
                    .click({force: true});
            }
        });
        return this;
    }

    closeTableFilterPanel() {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const visible = _.find(`[test-filtering-panel]`).is(':visible');
            if (visible) { // visible , close filtering panel
                cy.get(`[test-validation-result-table]`)
                    .find(`[test-button-filter]`)
                    .click({force: true});
            }
        });
        return this;
    }

    checkFilterCheckbox(attributeName: string, check: boolean): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table] [test-filtering-panel]`).then((_) => {
            const l = _.find(`[test-mat-checkbox-visible='${attributeName}'].mat-checkbox-checked`).length;
            if (l > 0 && !check) { // already checked, but we want it unchecked
                cy.get(`[test-validation-result-table]`)
                    .find(`[test-filtering-panel]`)
                    .find(`[test-mat-checkbox-visible='${attributeName}'] label`)
                    .click({force: true})
            } else if (l <= 0 && check) { // not checked, but we want it checked
                cy.get(`[test-validation-result-table]`)
                    .find(`[test-filtering-panel]`)
                    .find(`[test-mat-checkbox-visible='${attributeName}'] label`)
                    .click({force: true})
            }
        });
        return this;
    }

    verifyAttributeCellExists(attributeName: string, b: boolean): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table]`)
            .find(`[test-table-attribute-column='${attributeName}']`)
            .should('have.length', b ? 1 : 0);
        return this;
    }

    moveAttributeFilterOrderUp(attributeName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-filtering-panel]`)
            .find(`[test-icon-filter-up='${attributeName}']`)
            .should('be.visible')
            .click({force: true})
        return this;
    }


    moveAttributeFilterOrderDown(attributeName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-filtering-panel]`)
            .find(`[test-icon-filter-down='${attributeName}']`)
            .should('be.visible')
            .click({force: true})
        return this;
    }

    verifyAttributeCellOrder(attributeName: string, number: number) {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table]`)
            .find(`[test-table-attribute-column='${attributeName}']`)
            .should('have.attr', `test-table-attribute-column-index`, String(number))
        ;
        return this;
    }

    expandRow(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const l = _.find(`[test-icon-expand-row='${itemName}']`).length;
            if (l > 0 ) { // exists, can be expanded (not already expanded)
                cy.get(`[test-validation-result-table]`)
                    .find(`[test-icon-expand-row='${itemName}']`)
                    .click({force: true});
            }
        })
        return this;
    }

    collapseRow(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const l = _.find(`[test-icon-collapse-row='${itemName}']`).length;
            if (l > 0 ) { // exists, can be collapse (not already collapsed)
                cy.get(`[test-validation-result-table]`)
                    .find(`[test-icon-collapse-row='${itemName}']`)
                    .click({force: true});
            }
        })
        return this;
    }

    verifyItemExists(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .should('be.visible');
        return this;
    }

    verifyItemNotExists(itemName: string) {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .should('not.be.visible' );
        return this;
    }

    clickTableAttribute(itemName: string, attributeName: string): ViewValidationAttributePopupPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-data-editor='${attributeName}']`)
            .click({force: true});
        return new ViewValidationAttributePopupPage(this.validationName);
    }

    clickTableItemName(itemName: string): ViewValidationItemPopupPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .click({force: true});
        return new ViewValidationItemPopupPage(this.validationName);
    }

    clickTableItemDescription(itemName: string): ViewValidationItemPopupPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .click({force: true});
        return new ViewValidationItemPopupPage(this.validationName);
    }

    verifyItemWithAttributeExists(itemName: string, attributeName: string, attributeValues: string[]) {
        cy.wrap(attributeValues).each((e, i, a) => {
            cy.get(`[test-validation-result-table]`)
                .find(`[test-table-row-item='${itemName}']`)
                .find(`[test-data-editor='${attributeName}']`)
                .find(`[test-data-editor-value='${attributeName}']`)
                .should('contain.text', attributeValues[i]);
        });
    }
}
