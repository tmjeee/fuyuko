
import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewViewEditPopupPage} from "./sub-sub-page-object/view-view-edit-popup.page";

export class ViewViewPage implements ActualPage<ViewViewPage> {

    validateTitle(): ViewViewPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-views');
        return this;
    }

    visit(): ViewViewPage {
        cy.visit(`/view-gen-layout/(views//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewViewPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(callbackFn?: () => void): ViewViewPage {
        util.clickOnSuccessMessageToasts(callbackFn);
        return this;
    }

    clickAdd(): ViewViewEditPopupPage {
        cy.get(`[test-button-add-view]`).click({force: true});
        return new ViewViewEditPopupPage();
    }

    clickDelete(viewNames: string[]): ViewViewPage {
        cy.wrap(viewNames).each((e, i, a) => {
            cy.get(`[test-page-title]`).then((_) => {
                const length = _.find(`[test-mat-checkbox='${viewNames[i]}'].mat-checkbox-checked`).length;
                if (length <= 0) { // not already checked
                    cy.get(`[test-mat-checkbox='${viewNames[i]}'] label`).click({force: true});
                }
            })
        });
        cy.get(`[test-button-delete-view]`).click({force: true});
        return this;
    }

    clickSave(): ViewViewPage {
        cy.get(`[test-button-save-view]`).click({force: true});
        return this;
    }

    clickReload(): ViewViewPage {
        cy.get(`[test-button-reload-view]`).click({force:true});
        return this;
    }

    verifyViewExits(viewName: string): ViewViewPage {
        cy.get(`[test-row-view='${viewName}']`).should('exist');
        return this;
    }

    verifyViewDontExits(viewName: string): ViewViewPage {
        cy.get(`[test-row-view='${viewName}']`).should('not.exist');
        return this;
    }

    verifyViewDescription(viewName: string, viewDescription: string): ViewViewPage {
        cy.get(`[test-row-view='${viewName}']`)
            .find(`[test-view-editor='description']`)
            .find(`[test-view-editor-value='description']`)
            .should('contain.value', viewDescription);
        return this;
    }

    verifyViewName(viewName: string): ViewViewPage {
        cy.get(`[test-row-view='${viewName}']`)
            .find(`[test-view-editor='name']`)
            .find(`[test-view-editor-value='name']`)
            .should('contain.value', name);
        return this;
    }

}
