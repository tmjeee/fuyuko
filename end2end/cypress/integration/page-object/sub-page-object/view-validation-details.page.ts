import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewValidationPage} from "./view-validation.page";
import {ViewValidationAttributePopupPage} from "./sub-sub-page-object/view-validation-attribute-popup.page";
import {ViewValidationItemPopupPage} from "./sub-sub-page-object/view-validation-item-popup.page";

const PAGE_NAME = 'view-validation-details';
export class ViewValidationDetailsPage implements ActualPage<ViewValidationDetailsPage> {

    constructor(private validationName: string){ }

    selectGlobalView(viewName: string): ViewValidationDetailsPage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true});
        return this;
    }

    validateTitle(): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewValidationDetailsPage {
        // cy.visit(`/view-gen-layout/(validation-details/view/${this.viewId}/validation/${this.validationId}//help:view-help)`);
        new ViewValidationPage()
            .visit()
            .clickOnValidationDetails(this.validationName);
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewValidationDetailsPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): ViewValidationDetailsPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewValidationDetailsPage {
        util.clickOnSuccessMessageToasts();
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
                return cy.get(`[test-mat-radio-item='${itemName}'] label`).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    uncheckItemRadioButton(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-page-title]`).then((_) => {
            const l = _.find(`[test-mat-radio-item='${itemName}'].mat-radio-checked`).length;
            if (l > 0) { // already checked, let's uncheck it
                return cy.get(`[test-mat-radio-item='${itemName}'] label`).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }


    openTableFilterPanel() {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const visible = _.find(`[test-filtering-panel]`).is(':visible');
            if (!visible) { // not visible yet, open filtering panel
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-button-filter]`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }


    clickSave(): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-button-save]`)
            .click({force: true});
        return this;
    }

    clickReload(): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-button-reload]`)
            .click({force: true});
        return this;
    }


    closeTableFilterPanel() {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const visible = _.find(`[test-filtering-panel]`).is(':visible');
            if (visible) { // visible , close filtering panel
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-button-filter]`)
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    checkFilterCheckbox(attributeName: string, check: boolean): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table] [test-filtering-panel]`).then((_) => {
            const l = _.find(`[test-mat-checkbox-visible='${attributeName}'].mat-checkbox-checked`).length;
            if (l > 0 && !check) { // already checked, but we want it unchecked
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-filtering-panel]`)
                    .find(`[test-mat-checkbox-visible='${attributeName}'] label`)
                    .click({force: true})
            } else if (l <= 0 && check) { // not checked, but we want it checked
                return cy.get(`[test-validation-result-table]`)
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
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-icon-expand-row='${itemName}']`)
                    .click({force: true});
            }
            return cy.wait(1000);
        })
        return this;
    }

    collapseRow(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const l = _.find(`[test-icon-collapse-row='${itemName}']`).length;
            if (l > 0 ) { // exists, can be collapse (not already collapsed)
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-icon-collapse-row='${itemName}']`)
                    .click({force: true});
            }
            return cy.wait(1000);
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
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true});
        return new ViewValidationAttributePopupPage(this.validationName);
    }

    clickTableItemName(itemName: string): ViewValidationItemPopupPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .find(`[test-item-editor-value='name']`)
            .click({force: true});
        return new ViewValidationItemPopupPage(this.validationName);
    }

    clickTableItemDescription(itemName: string): ViewValidationItemPopupPage {
        cy.get(`[test-validation-result-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .find(`[test-item-editor='description']`)
            .find(`[test-item-editor-value='description']`)
            .click({force: true});
        return new ViewValidationItemPopupPage(this.validationName);
    }

    selectTableItem(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const l = _.find(`[test-mat-radio-item='${itemName}'].mat-radio-checked`).length;
            if (l <= 0) { // not already selected
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-mat-radio-item='${itemName}'] label`)
                    .click({force: true})
            }
            return cy.wait(1000);
        })
        return this;
    }

    unselectTableItem(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-validation-result-table]`).then((_) => {
            const l = _.find(`[test-mat-radio-item='${itemName}'].mat-radio-checked`).length;
            if (l > 0) { // already selected
                return cy.get(`[test-validation-result-table]`)
                    .find(`[test-mat-radio-item='${itemName}'] label`)
                    .click({force: true})
            }
            return cy.wait(1000);
        })
        return this;
    }

    verifyItemWithAttributeExists(itemName: string, attributeName: string, attributeValues: string[]): ViewValidationDetailsPage {
        cy.wrap(attributeValues).each((e, i, a) => {
            return cy.get(`[test-validation-result-table]`)
                .find(`[test-table-row-item='${itemName}']`)
                .find(`[test-data-editor='${attributeName}']`)
                .find(`[test-data-editor-value='${attributeName}']`)
                .should('contain.text', attributeValues[i]);
        });
        return this;
    }

    verifyTableItemSelected(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-table]`)
            .find(`[test-table-row-item='${itemName}']`)
            .should('have.class', 'selected')
        return this;
    }

    verifyTreeItemSelected(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-mat-tree]`)
            .find(`[test-tree-node-item-name='${itemName}']`)
            .should('have.class', 'selected')
        return this;
    }

    verifyConsoleNotEmpty(): ViewValidationDetailsPage {
        cy.get(`[test-console]`)
            .find(`[test-console-empty]`)
            .should('not.exist');
        return this;
    }

    verifyConsoleHasItem(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-console]`)
            .find(`[test-console-items]`)
            .should('exist');
        cy.get(`[test-console]`)
            .find(`[test-console-item-name='${itemName}']`)
            .should('exist');
        return this;
    }

    verifyConsoleHasError(): ViewValidationDetailsPage {
        cy.get(`[test-console]`)
            .find(`[test-console-errors]`)
            .should('exist');
        return this;
    }

    selectTreeItem(itemName: string): ViewValidationDetailsPage {
        cy.get(`[test-mat-tree]`)
            .find(`[test-tree-node-item-name='${itemName}'] span.icon-text`)
            .click({force: true})
        ;
        return this;
    }
}
