import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewDataListEditPopupPage} from "./sub-sub-page-object/view-data-list-edit-popup.page";
import {ViewDataListItemPopupPage} from "./sub-sub-page-object/view-data-list-item-popup.page";
import {ViewDataListAttributePopupPage} from "./sub-sub-page-object/view-data-list-attribute-popup.page";

const PAGE_NAME = 'view-data-list';
export class ViewDataListPage implements ActualPage<ViewDataListPage> {

    selectGlobalView(viewName: string): ViewDataListPage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true})
            .wait(1000);
        cy.waitUntil(() => cy.get(`[test-page-ready='true']`));
        return this;
    }

    validateTitle(): ViewDataListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewDataListPage {
        cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewDataListPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): ViewDataListPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewDataListPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }


    clickAdd(): ViewDataListEditPopupPage {
        cy.waitUntil(() => cy.get(`[test-button-add-item]`)).click({force: true});
        return new ViewDataListEditPopupPage();
    }

    clickSave(): ViewDataListPage {
        cy.waitUntil(() => cy.waitUntil(() => cy.get(`[test-button-save]`))).click({force: true});
        return this;
    }

    clickReload(): ViewDataListPage {
        cy.waitUntil(() => cy.get(`[test-button-reload-items]`)).click({force: true});
        return this;
    }

    clickDelete(itemNames: string[]): ViewDataListPage {
        cy.wrap(itemNames).each((e, i, a) => {
            return cy.get('[test-page-title]').then((_) => {
                const l = _.find(`[test-mat-checkbox-item='${itemNames[i]}'].mat-checkbox-checked`).length;
                if (l <= 0) { // not already checked
                    cy.waitUntil(() => cy.get(`[test-mat-checkbox-item='${itemNames[i]}'] label`)).click({force: true});
                }
                return cy.wait(1000);
            });
        });
        return this;
    }

    clickOnPanel(itemName: string): ViewDataListPage {
       cy.waitUntil(() => cy.get(`[test-panel-item='${itemName}'] section:first-child`)).click({force: true});
       return this;
    }

    verifyPanelExpanded(itemName: string): ViewDataListPage {
       cy.get(`[test-panel-item='${itemName}']`)
         .find(`[test-item-editor='name']`)
         .should( 'exist')
       ;
       cy.get(`[test-panel-item='${itemName}']`)
         .find(`[test-item-editor='name']`)
         .should( 'contain.text' , itemName)
       ;
       return this;
    }

    verifyPanelCollapsed(itemName: string): ViewDataListPage {
        cy.get(`[test-panel-item='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .should( 'not.be.visible')
        ;
        return this;
    }

    doBasicSearch(search: string): ViewDataListPage {
        cy.get(`[test-mat-tab-basic-search]`).click({force: true});
        cy.get(`[test-field-data-table-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
        return this;
    }

    verifyListResultSize(number: number): ViewDataListPage {
        cy.get(`[test-panel-item]`).should('have.length', number);
        return this;
    }

    verifyListHasItem(itemName: string, b: boolean): ViewDataListPage {
       cy.get(`[test-panel-item='${itemName}']`).should(b ? 'exist' : 'not.exist');
       return this;
    }

    verifyInPanelItemName(itemName: string): ViewDataListPage {
        cy.get(`[test-panel-item='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .find(`[test-item-editor-value='name']`)
            .should('contain.text', itemName);
        return this;
    }

    verifyInPanelItemNotName(itemName: string): ViewDataListPage {
        cy.get(`[test-panel-item='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .find(`[test-item-editor-value='name']`)
            .should('not.contain.text', itemName);
        return this;
    }

    verifyInPanelItemDescription(itemName: string, itemDescription: string) {
        cy.get(`[test-panel-item='${itemName}']`)
            .find(`[test-item-editor='description']`)
            .find(`[test-item-editor-value='description']`)
            .should('contain.text', itemDescription);
        return this;
    }

    verifyInPanelItemNotDescription(itemName: string, itemDescription: string) {
        cy.get(`[test-panel-item='${itemName}']`)
            .find(`[test-item-editor='description']`)
            .find(`[test-item-editor-value='description']`)
            .should('not.contain.text', itemName);
        return this;
    }

    verifyInPanelAttributeValue(itemName: string, attributeName: string, value: string[]) {
        cy.wrap(value).each((e, i, a) => {
            return cy.get(`[test-panel-item='${itemName}']`)
                .find(`[test-data-editor='${attributeName}']`)
                .find(`[test-data-editor-value='${attributeName}']`)
                .should('contain.text', value[i])
        });
        return this;
    }

    verifyInPanelAttributeNotValue(itemName: string, attributeName: string, value: string[]) {
        cy.wrap(value).each((e, i, a) => {
            return cy.get(`[test-panel-item='${itemName}']`)
                .find(`[test-data-editor='${attributeName}']`)
                .find(`[test-data-editor-value='${attributeName}']`)
                .should('not.contain.text', value[i])
        });
        return this;
    }

    clickOnItemName(itemName: string): ViewDataListItemPopupPage {
        cy.waitUntil(() =>
            cy.get(`[test-panel-item='${itemName}'] [test-item-editor='name'] [test-item-editor-value='name']`))
            .click({force: true});
        return new ViewDataListItemPopupPage();
    }

    clickOnItemDescription(itemName: string): ViewDataListItemPopupPage {
        cy.waitUntil(() =>
            cy.get(`[test-panel-item='${itemName}'] [test-item-editor='description'] [test-item-editor-value='description']`))
            .click({force: true});
        return new ViewDataListItemPopupPage();
    }

    clickOnAttribute(itemName: string, attributeName: string): ViewDataListAttributePopupPage {
        cy.waitUntil(() =>
            cy.get(`[test-panel-item='${itemName}'] [test-data-editor='${attributeName}'] [test-data-editor-value='${attributeName}']`))
            .click({force: true});
        return new ViewDataListAttributePopupPage()
    }
}
