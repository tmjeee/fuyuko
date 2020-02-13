import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewDataEditorPopupPage} from "./sub-sub-page-object/view-data-editor-popup.page";

export class ViewDataTablePage implements ActualPage<ViewDataTablePage> {

    validateTitle(): ViewDataTablePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-table');
        return this;
    }

    visit(): ViewDataTablePage {
        cy.visit(`/view-gen-layout/(data-tabular//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataTablePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataTablePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    doBasicSearch(search: string): ViewDataTablePage {
        cy.get(`[test-mat-tab-basic-search]`).click({force: true});
        cy.get(`[test-field-data-table-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
        return this;
    }

    selectBasicSearch(): ViewDataTablePage {
        cy.get(`[test-mat-tab-basic-search]`).click({force: true});
        return this;
    }

    verifyDataTableResultSize(size: number): ViewDataTablePage {
        cy.get(`[test-data-table-row]`).should('have.length.gte', size);
        return this;
    }

    verifyDataTableHasItem(itemName: string, b: boolean): ViewDataTablePage {
        cy.get(`[test-data-table-row='${itemName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    openFilterBox(): ViewDataTablePage {
        cy.get('[test-page-title]').then((e) => {
            const visible = e.find(`[test-filtering-container]`).is(':visible');
            if (!visible) {
                // not opened yet
                cy.get(`[test-button-filter-items]`).click({force: true});
            }
        });
        return this;
    }

    closeFilterBox(): ViewDataTablePage {
        cy.get('[test-page-title]').then((e) => {
            const visible = e.find(`[test-filtering-container]`).is(':visible');
            if (visible) {
                // already open
                cy.get(`[test-button-filter-items]`).click({force: true});
            }
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
            console.log('*** already checked', c);
            if (c && !b) { // already checked but we want to uncheck it
                cy.get(`[test-checkbox-item-filtering='${attributeName}'] label`).click({force: true});
            } if (!c && b) { // already unchecked but we want to check it
                cy.get(`[test-checkbox-item-filtering='${attributeName}'] label`).click({force: true});
            }
        });
        return this;
    }

    verifyAttributeCellExists(attributeName: string, b: boolean) : ViewDataTablePage {
        cy.get(`[test-data-table-attribute='${attributeName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    moveAttributeFilterOrderUp(attributeName: string): ViewDataTablePage {
        cy.get('[test-page-title]').then((e) => {
            const l = e.find(`[test-button-item-filtering-up]`).length;
            if (l) {
               cy.get(`[test-button-item-filtering-up]`).click({force: true});
            }
        })
        return this;
    }

    moveAttributeFilterOrderDown(attributeName: string): ViewDataTablePage {
        cy.get('[test-page-title]').then((e) => {
            const l = e.find(`[test-button-item-filtering-down]`).length;
            if (l) {
                cy.get(`[test-button-item-filtering-down]`).click({force: true});
            }
        })
        return this;
    }

    verifyAttributeCellOrder(attributeName: string, order: number): ViewDataTablePage {
        cy.get(`[test-data-table-attribute='${attributeName}']`)
            .should('have.attr', `test-data-table-attribute-index`, order);
        return this;
    }

    clickOnItemAttributeCellToEdit(itemName: string, attributeName: string): ViewDataEditorPopupPage {
        cy.get(`[test-data-table-row='${itemName}']`)
            .find(`[test-data-editor='${attributeName}']`)
            .click({force: true});
        return new ViewDataEditorPopupPage();
    }

    clickOnAddItem(): ViewDataTablePage {
        cy.get(`[test-button-add-item]`).click({force: true});
        return this;
    }

    clickOnDeleteItem(itemNames: string[]): ViewDataTablePage {
        cy.wrap(itemNames).each((e, i, a) => {
            cy.get('[test-page-title]').then((_) => {
                const l = _.find(`[test-checkbox-data-table-item='${itemNames[i]}].mat-checkbox-checked`).length;
                if (!l) { // not already checked
                    cy.get(`[test-checkbox-data-table-item='${itemNames[i]}'] label`).click({force: true});
                }
            })
        });
        cy.get(`[test-button-delete-items]`).click({force: true});
        return this;
    }

    clickOnSaveItem(): ViewDataTablePage {
        cy.get(`[test-button-save-items]`).click({force: true});
        return this;
    }

    clickReload(): ViewDataTablePage {
        cy.get(`[test-button-reload-items]`).click({force: true});
        return this;
    }


}
