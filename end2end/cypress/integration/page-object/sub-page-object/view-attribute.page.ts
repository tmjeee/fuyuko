import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewAttributeAddPage} from "./sub-sub-page-object/view-attribute-add.page";
import {ViewAttributeEditPage} from "./sub-sub-page-object/view-attribute-edit.page";

const PAGE_NAME = 'view-attributes';
export class ViewAttributePage implements ActualPage<ViewAttributePage> {


    selectGlobalView(viewName: string): ViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-mat-select-global-view]`)).first().click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-global-view='${viewName}']`)).click({force: true});
        return this;
    }

    validateTitle(): ViewAttributePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): ViewAttributePage {
        cy.visit('/view-gen-layout/(attributes//help:view-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): ViewAttributePage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }


    verifyErrorMessageExists(): ViewAttributePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ViewAttributePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    ////////


    search(search: string): ViewAttributePage {
       cy.waitUntil(() => cy.get(`[test-field-search]`))
           .clear({force: true})
           .type(`${search}{enter}`, {force: true})
       return this;
    }

    verifyAttributeTableEntriesCount(count: number): ViewAttributePage {
        this.selectPagination(100);
        cy.get(`[test-attribute-name]`)
            .should('have.length.gte', count);
        return this;
    }

    verifyAttributeTableHaveAttribute(attributeName: string): ViewAttributePage {
        this.selectPagination(100);
        cy.get(`[test-attribute-name='${attributeName}']`)
            .should('exist');
        return this;
    }

    selectPagination(pagination: 50 | 100): ViewAttributePage {
        cy.waitUntil(() => cy.get(`app-pagination mat-select`)).click({force: true});
        cy.waitUntil(() => cy.get(`mat-option[ng-reflect-value='100']`)).click({force: true});
        cy.wait(100);
        return this;
    }

    clickAddAttribute(): ViewAttributeAddPage {
        cy.waitUntil(() => cy.get(`[test-button-add-attribute]`)).click({force: true});
        return new ViewAttributeAddPage();
    }

    clickDeleteAttribute(attributeName: string): ViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-button-delete-attribute='${attributeName}']`)).click({force: true});
        return this;
    }

    clickEditAttribute(attributeName: string): ViewAttributeEditPage {
        cy.waitUntil(() => cy.get(`[test-button-edit-attribute='${attributeName}']`)).click({force: true});
        return new ViewAttributeEditPage();
    }
}
