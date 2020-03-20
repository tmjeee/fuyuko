import {ActualPage} from "../actual.page";
import * as util from '../../util/util';
import {ImportPageStep1, ImportPageStep2, ImportPageStep3} from "./import.page";


export class ExportPage implements ActualPage<ExportPage> {

    visit(): ExportPage {
        cy.visit('/import-export-gen-layout/(export//help:import-help)');
        return this;
    }

    validateTitle(): ExportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'export');
        return this;
    }

    verifyErrorMessageExists(): ExportPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ExportPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    /////////////////////////

    clickStep1(): ExportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`).click({force: true});
        return new ExportPageStep1();
    }
}

export class ExportPageStep1 {

    verifyInStep(): ExportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectImportView(viewName: string): ExportPageStep1 {
        cy.get(`[test-mat-select-step1-export-view] div:first-child`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-step1-export-view='${viewName}']`).click({force: true});
        return this;
    }

    verifyCanClickNext(b: boolean): ExportPageStep1 {
        cy.get(`[test-button-step1-next]`).should(b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): ExportPageStep2 {
        cy.get(`[test-button-step1-next]`).click({force: true});
        return new ImportPageStep2();
    }
}


export class ExportPageStep2 {

    verifyInStep(): ExportPageStep2 {
        cy.get(`mat-step-header[aria-posinset='2'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    clickBack(): ExportPageStep1 {
        cy.get(`[test-button-step2-back]`).click({force: true});
        return new ExportPageStep1();
    }

    clickNext(): ExportPageStep3 {
        cy.get(`[test-button-step2-next]`).click({force: true});
        return new ExportPageStep3();
    }

    selectExportType(type: 'ATTRIBUTE' | 'ITEM' | 'PRICE'): ExportPageStep2 {
        cy.get(`[test-mat-select-step2-import-type] div:first-child`).click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-step2-import-type='${type}']`).click({force: true});
        return this;
    }

    selectExportAllAttributes(): ExportPageStep2 {
        cy.get(`[test-radio-step2-export-all-attributes]`).click({force: true});
        return this;
    }

    selectExportSelectedAttributes(attributeNames: string[]): ExportPageStep2 {
        cy.get(`[test-radio-step2-export-selected-attributes]`).click({force: true});
        cy.wrap(attributeNames).each((e, i, a) => {
            cy.get(`[test-checkbox-step2-attribute-select='${attributeNames[i]}']`).click({force: true});
        });
        return this;
    }
}

export class ExportPageStep3 {

}

export class ExportPageStep4 {

}

export class ExportpageStep5 {

}
