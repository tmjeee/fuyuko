import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewDataThumbnailEditPopupPage} from "./sub-sub-page-object/view-data-thumbnail-edit-popup.page";
import {ViewDataThumbnailItemPopupPage} from "./sub-sub-page-object/view-data-thumbnail-item-popup.page";
import {ViewDataThumbnailAttributePopupPage} from "./sub-sub-page-object/view-data-thumbnail-attribute-popup.page";

export class ViewDataThumbnailPage implements ActualPage<ViewDataThumbnailPage> {

    validateTitle(): ViewDataThumbnailPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-thumbnail');
        return this;
    }

    visit(): ViewDataThumbnailPage {
        cy.visit(`/view-gen-layout/(data-thumbnail//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataThumbnailPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataThumbnailPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    doBasicSearch(search: string): ViewDataThumbnailPage {
        cy.get(`[test-mat-tab-basic-search]`).click({force: true});
        cy.get(`[test-field-data-table-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true})
        return this;
    }

    verifyThumbnailsResultSize(number: number): ViewDataThumbnailPage {
        cy.get(`[test-thumbnail-item-name]`).should('have.length.gte', number);
        return this;
    }

    verifyThumbnailsHasItem(itemName: string, b: boolean): ViewDataThumbnailPage {
        cy.get(`[test-thumbnail-item-name='${itemName}']`).should(b ? 'exist' : 'not.exist');
        return this;
    }

    clickAddThumbnail(newItemName: string): ViewDataThumbnailPage {
        cy.get(`[test-button-add-item]`).click({force: true});
        cy.get(`[test-popup-dialog-title='item-data-editor-popup']`)
            .find(`[test-item-editor-value='name']`)
            .click({force: true});
        cy.get(`[test-popup-dialog-title='item-editor-dialog-popup']`)
            .find(`[test-field-name]`)
            .clear({force: true})
            .type(`${newItemName}`, {force: true})
        cy.get(`[test-button-item-editor-popup-ok]`)
            .click({force: true})
        cy.wait(100);
        cy.get(`[test-popup-dialog-title='item-data-editor-popup']`)
            .find(`[test-button-item-data-editor-popup-ok]`)
            .click({force: true})
        ;
        return this;
    }

    clickOnDeleteThumbnail(itemNames: string[]): ViewDataThumbnailPage {
        cy.wrap(itemNames).each((e, i, a) => {
            cy.get('[test-page-title]').then((_) => {
                const l = _.find(`[test-checkbox-thumbnail-item='${itemNames[i]}'].mat-checkbox-checked`).length;
                if (!l) { // not already checked
                    cy.get(`[test-checkbox-thumbnail-item='${itemNames[i]}'] label`).click({force: true});
                }
            })
        }).then((_) => {
            cy.get(`[test-button-delete-items]`).click({force: true});
        });
        return this;
    }

    clickEditThumbnailIcon(itemName: string): ViewDataThumbnailEditPopupPage {
        cy.get(`[test-icon-thumbnail-edit-item='${itemName}']`).click({force: true});
        return new ViewDataThumbnailEditPopupPage();
    }

    clickThumbnailItemName(itemName: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-thumbnail-item-name='${itemName}']`)
            .find(`[test-item-editor='name']`)
            .find(`[test-item-editor-value='name']`)
            .click({force: true});
        return new ViewDataThumbnailItemPopupPage();
    }

    clickThumbnailItemDescription(itemName: string): ViewDataThumbnailItemPopupPage {
        cy.get(`[test-thumbnail-item-name='${itemName}']`)
            .find(`[test-item-editor='description']`)
            .find(`[test-item-editor-value='description']`)
            .click({force: true});
        return new ViewDataThumbnailItemPopupPage();
    }

    clickThumbnailItemAttribute(itemName: string, attributeName: string): ViewDataThumbnailAttributePopupPage {
        cy.get(`[test-thumbnail-item-name='${itemName}']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true});
        return new ViewDataThumbnailAttributePopupPage();
    }

    clickOnSave(): ViewDataThumbnailPage {
        cy.get(`[test-button-save-items]`).click({force: true});
        return this;
    }

    clickOnReload(): ViewDataThumbnailPage {
        cy.get(`[test-button-reload]`).click({force: true});
        return this;
    }
}
