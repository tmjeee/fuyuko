import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewDataTableEditPopupPage} from "./sub-sub-page-object/view-data-table-edit-popup.page";

const PAGE_NAME = 'view-data-table';
export class ViewDataTablePage implements ActualPage<ViewDataTablePage> {

    selectGlobalView(viewName: string): ViewDataTablePage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true})
            .wait(1000);
        cy.waitUntil(() => cy.get(`[test-page-ready='true']`));
        return this;
    }


    validateTitle(): ViewDataTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewDataTablePage {
        cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        this.waitForReady();
        return this;
    }

    waitForItemEditPopupReady(): ViewDataTablePage {
        util.waitUntilPopupReady(`item-editor-dialog-popup`);
        return this;
    }

    waitForItemEditPopupGone(): ViewDataTablePage {
        util.waitUntilPopupGone(`item-editor-dialog-popup`);
        return this;
    }

    waitForAttributeEditPopupReady(): ViewDataTablePage {
        util.waitUntilPopupReady(`data-editor-dialog-popup`);
        return this;
    }

    waitForAttributeEditPopupGone(): ViewDataTablePage {
        util.waitUntilPopupGone(`data-editor-dialog-popup`);
        return this;
    }

    waitForReady(): ViewDataTablePage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): ViewDataTablePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewDataTablePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    doBasicSearch(search: string): ViewDataTablePage {
        cy.waitUntil(() => cy.get(`[test-mat-tab-basic-search]`)).click({force: true});
        cy.waitUntil(() => cy.get(`[test-field-data-table-search]`))
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
        return this;
    }

    selectBasicSearch(): ViewDataTablePage {
        cy.waitUntil(() => cy.get(`[test-mat-tab-basic-search]`)).click({force: true});
        return this;
    }

    verifyDataTableResultSize(size: number): ViewDataTablePage {
        cy.get(`[test-data-table-row]`).should('have.length.gte', size);
        return this;
    }

    verifyDataTableHasItem(itemName: string, b: boolean): ViewDataTablePage {
        cy.get(`[test-data-table-row='${itemName}']`).should( b ? 'exist' :'not.exist');
        return this;
    }

    openFilterBox(): ViewDataTablePage {
        cy.get('[test-page-title]').then((e) => {
            const visible = e.find(`[test-filtering-container]`).is(':visible');
            if (!visible) {
                // not opened yet
                cy.waitUntil(() => cy.get(`[test-button-filter-items]`)).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    closeFilterBox(): ViewDataTablePage {
        cy.get('[test-page-title]').then((e) => {
            const visible = e.find(`[test-filtering-container]`).is(':visible');
            if (visible) {
                // already open
                cy.waitUntil(() => cy.get(`[test-button-filter-items]`)).click({force: true});
            }
            return cy.wait(1000);
        });
       return this;
    }

    verifyFilterBoxOpen(b: boolean): ViewDataTablePage {
        cy.get(`[test-filtering-container]`).should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }


    checkFilterCheckbox(attributeName: string, b: boolean): ViewDataTablePage {
        cy.get(`[test-page-title]`).then((e) => {
            const c = e.find(`[test-checkbox-item-filtering='${attributeName}'].mat-checkbox-checked `).length;
            if (c && !b) { // already checked but we want to uncheck it
                cy.waitUntil(() => cy.get(`[test-checkbox-item-filtering='${attributeName}'] label`)).click({force: true});
            } if (!c && b) { // already unchecked but we want to check it
                cy.waitUntil(() => cy.get(`[test-checkbox-item-filtering='${attributeName}'] label`)).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    verifyAttributeCellExists(attributeName: string, b: boolean) : ViewDataTablePage {
        cy.get(`[test-data-table-attribute='${attributeName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    moveAttributeFilterOrderUp(attributeName: string): ViewDataTablePage {
        cy.waitUntil(() => cy.get(`[test-page-title]
            [test-item-filtering='${attributeName}']`)).then((e) => {
            const l = e.find(`[test-button-item-filtering-up]`).length;
            if (l) {
                cy.waitUntil(() => cy.get(`[test-page-title]
                    [test-item-filtering='${attributeName}']
                    [test-button-item-filtering-up]`))
                    .click({force: true});
            }
            return cy.wait(1000);
        })
        return this;
    }

    moveAttributeFilterOrderDown(attributeName: string): ViewDataTablePage {
        cy.waitUntil(() => cy.get(`[test-page-title]
            [test-item-filtering='${attributeName}']`)).then((e) => {
            const l = e.find(`[test-button-item-filtering-down]`).length;
            if (l) {
                cy.waitUntil(() => cy.get(`[test-page-title]
                    [test-item-filtering='${attributeName}']
                    [test-button-item-filtering-down]`))
                    .click({force: true});
            }
            return cy.wait(1000);
        })
        return this;
    }

    verifyAttributeCellOrder(attributeName: string, order: number): ViewDataTablePage {
        cy.get(`[test-data-table-attribute-name='${attributeName}']`)
            .should('have.attr', `test-data-table-attribute-index`, String(order));
        return this;
    }

    clickOnItemAttributeCellToEdit(itemName: string, attributeName: string): ViewDataTableEditPopupPage {
        cy.waitUntil(() => cy.get(`[test-data-table-row='${itemName}']
            [test-data-editor-value='${attributeName}']`))
            .click({force: true});
        return new ViewDataTableEditPopupPage();
    }

    clickOnAddItem(newItemName: string): ViewDataTablePage {
        cy.get(`[test-button-add-item]`).click({force: true});
        // cy.get(`[test-button-add-item]`).click({force: true});
        // cy.wait(10000);
        cy.get(`[test-data-table-root-row-index]`)
            .last()
            .find(`[test-item-editor-value='name']`)
            .click({force: true});
        this.waitForItemEditPopupReady();
        cy.get(`[test-field-name]`).clear({force: true}).type(newItemName, {force: true});
        cy.get(`[test-button-item-editor-popup-ok]`).click({force: true});
        this.waitForItemEditPopupGone();
        return this;
    }

    clickOnAddChildItem(childItemName: string, newItemName: string): ViewDataTablePage {
        cy.get(`[test-button-data-table-add-children='${childItemName}']`).click({force: true});
        cy.get(`[test-data-table-row-index]`)
            .last()
            .find(`[test-item-editor-value='name']`)
            .click({force: true});
        this.waitForItemEditPopupReady();
        cy.get(`[test-field-name]`).clear({force: true}).type(newItemName, {force: true});
        cy.get(`[test-button-item-editor-popup-ok]`).click({force: true});
        this.waitForItemEditPopupGone();
        return this;
    }

    expandRow(itemName: string): ViewDataTablePage {
        cy.get(`[test-data-table-toggle-expand='${itemName}']`).click({force: true});
        /*
        cy.waitUntil(() => cy.get(`[test-data-table-row-index='${rowIndex}']`)).then((_) => {
           const i = _.find(`[test-data-table-item-expanded='false']`).length;
           if (i) { // not expanded
               cy.waitUntil(() => cy.get(`[test-data-table-row-index='${rowIndex}]
                   [test-data-table-toggle-expand]`))
                   .click({force: true});
           }
           return cy.wait(1000);
        });
         */
        return this;
    }

    clickOnDeleteItem(itemNames: string[]): ViewDataTablePage {
        cy.wrap(itemNames).each((e, i, a) => {
            return cy.get('[test-page-title]').then((_) => {
                const l = _.find(`[test-checkbox-data-table-item='${itemNames[i]}'].mat-checkbox-checked`).length;
                if (!l) { // not already checked
                    cy.waitUntil(() => cy.get(`[test-checkbox-data-table-item='${itemNames[i]}'] label`))
                        .click({force: true});
                }
                return cy.wait(1000);
            })
        }).then((_) => {
            cy.waitUntil(() => cy.get(`[test-button-delete-items]`)).click({force: true});
        });
        return this;
    }

    clickOnDeleteChildItem(itemName: string): ViewDataTablePage {
        cy.waitUntil(() => cy.get(`[test-button-data-table-delete-item='${itemName}']`))
            .click({force: true});
        return this;
    }

    clickOnSaveItem(): ViewDataTablePage {
        cy.get(`[test-button-save-items]`).click({force: true});
        return this;
    }

    clickReload(): ViewDataTablePage {
        cy.get(`[test-button-reload-items]`).click({force: true});
        this.waitForReady();
        return this;
    }


    verifyAttributeCellValue(itemName: string, attributeName: string, ...value: string[]): ViewDataTablePage {
        cy.wrap(value).each((e, i, a) => {
            return cy.get(`[test-data-table-row='${itemName}']`)
                .find(`[test-data-table-attribute='${attributeName}']`)
                .find(`[test-data-editor-value]`).should('contain.text', value[i]);
        })
        return this;
    }

    verifyAttributeCellNotValue(itemName: string, attributeName: string, ...value: string[]): ViewDataTablePage {
        cy.wrap(value).each((e, i, a) => {
            return cy.get(`[test-data-table-row='${itemName}']`)
                .find(`[test-data-table-attribute='${attributeName}']`)
                .find(`[test-data-editor-value]`).should('not.contain.text', value[i]);
        });
        return this;
    }

    verifySaveEnable(b: boolean): ViewDataTablePage {
        this.waitForReady();
        cy.waitUntil(() => cy.get(`[test-page-title]
            [test-button-save-items]`)
            .should(b ? 'be.enabled' : 'be.disabled'));
        // cy.get(`[test-button-save-items]`).should(b ? 'be.enabled' : 'be.disabled');
        return this;
    }
}
