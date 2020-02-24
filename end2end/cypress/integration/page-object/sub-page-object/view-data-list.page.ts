import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewDataListEditPopupPage} from "./sub-sub-page-object/view-data-list-edit-popup.page";

export class ViewDataListPage implements ActualPage<ViewDataListPage> {

    validateTitle(): ViewDataListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-list');
        return this;
    }

    visit(): ViewDataListPage {
        cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataListPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataListPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }


    clickAdd(): ViewDataListEditPopupPage {
        return new ViewDataListEditPopupPage();
    }

    clickReload(): ViewDataListPage {
        return this;
    }

    clickDelete(itemNames: string[]): ViewDataListPage {
        return this;
    }

    clickOnPanel(itemName: string): ViewDataListPage {
       cy.get(`[test-panel-item='${itemName}'] section:first-child`).click({force: true});
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
}
