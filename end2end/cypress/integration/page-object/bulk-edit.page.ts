import {ActualPage} from "./actual.page";
import * as util from '../util/util';
import {OperatorType} from "../model/operator.model";


export class BulkEditPage implements ActualPage<BulkEditPage> {

    constructor() { }

    visit(): BulkEditPage {
        cy.visit('/gen-layout/(bulk-edit//help:bulk-edit-help)');
        return this;
    }

    validateTitle(): BulkEditPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'bulk-edit');
        return this;
    }

    verifyErrorMessageExists(): BulkEditPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): BulkEditPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    ////////////////////

    selectView(viewName: string): BulkEditPage {
        cy.get(`[test-page-title='bulk-edit']`)
            .find(`[test-mat-select-current-view] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-current-view='${viewName}']`)
            .click({force: true});
        return this;
    }

    verifySelectedView(viewName: string): BulkEditPage {
        cy.get(`[test-page-title='bulk-edit']`)
            .find(`[test-bulk-edit-wizard='${viewName}']`)
            .should('exist');
        return this;
    }


    startWizard(): BulkEditPageStep1 {
        return new BulkEditPageStep1();
    }


}

export class BulkEditPageStep1 {

    verifyStep(): BulkEditPageStep1 {
        cy.get(`mat-step-header[ng-reflect-index='0']`)
            .should('have.attr', 'ng-reflect-selected', 'true');
        return this;
    }

    selectAttribute(index: number, attributeName: string): BulkEditPageStep1 {
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-mat-select-attribute] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-attribute='${attributeName}']`)
            .click({force: true});
        cy.wait(100);
        return this;
    }

    editChangeString(index: number, attributeName: string, value: string): BulkEditPageStep1 {
        this.selectAttribute(index, attributeName);
        cy.get(`[test-field-string]`);
        cy.get(`[test-change-clause-editor='${index}']`)
            .find(`[test-field-string]`)
            .clear({force: true})
            .type(value, {force: true});
        return this;
    }

    editWhenString(index: number, attributeName: string, operator: OperatorType, value: string): BulkEditPageStep1 {
        return this;
    }
}
