import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewAttributeAddPage} from "./sub-sub-page-object/view-attribute-add.page";
import {ViewAttributeEditPage} from "./sub-sub-page-object/view-attribute-edit.page";

export class ViewAttributePage implements ActualPage<ViewAttributePage> {

    validateTitle(): ViewAttributePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-attributes');
        return this;
    }

    visit(): ViewAttributePage {
        cy.visit('/view-gen-layout/(attributes//help:view-help)');
        return this;
    }


    verifyErrorMessageExists(): ViewAttributePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewAttributePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    ////////


    search(search: string): ViewAttributePage {
       cy.get(`[test-field-search]`)
           .clear({force: true})
           .type(`${search}{enter}`, {force: true})
       return this;
    }

    verifyAttributeTableEntriesCount(count: number): ViewAttributePage {
        cy.get(`[test-attribute-name]`)
            .should('have.length', count);
        return this;
    }

    verifyAttributeTableHaveAttribute(attributeName: string): ViewAttributePage {
        cy.get(`[test-attribute-name='${attributeName}']`)
            .should('exist');
        return this;
    }

    clickAddAttribute(): ViewAttributeAddPage {
        cy.get(`[test-button-add-attribute]`).click({force: true});
        return new ViewAttributeAddPage();
    }

    clickDeleteAttribute(attributeName: string): ViewAttributePage {
        cy.get(`[test-button-delete-attribute='${attributeName}']`).click({force: true});
        return this;
    }

    clickEditAttribute(attributeName: string): ViewAttributeEditPage {
        cy.get(`[test-button-edit-attribute='${attributeName}']`).click({force: true});
        return new ViewAttributeEditPage();
    }
}
