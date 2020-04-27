import {ActualPage} from "../actual.page";
import * as util from '../../util/util';
import 'cypress-file-upload';
import {AttributeType} from "../../model/attribute.model";

const PAGE_NAME = 'import';
export class ImportPage implements ActualPage<ImportPage> {

    visit(): ImportPage {
        cy.visit('/import-export-gen-layout/(import//help:import-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): ImportPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    validateTitle(): ImportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): ImportPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): ImportPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    clickStep1(): ImportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`).click({force: true});
        return new ImportPageStep1();
    }
}


export class ImportPageStep1 {

    verifyInStep(): ImportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectImportView(viewName: string): ImportPageStep1 {
        cy.get(`[test-mat-select-step1-import-view]`).first().click({force: true});
        cy.get(`[test-mat-select-option-step1-import-view='${viewName}']`).click({force: true});
        return this;
    }

    verifyCanClickNext(b: boolean): ImportPageStep1 {
        cy.get(`[test-button-step1-next]`).should(b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): ImportPageStep2 {
        cy.get(`[test-button-step1-next]`).click({force: true});
        return new ImportPageStep2();
    }
}

export class ImportPageStep2 {

    verifyInStep(): ImportPageStep2 {
        cy.get(`mat-step-header[aria-posinset='2'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    clickBack(): ImportPageStep1 {
        cy.get(`[test-button-step2-back]`).click({force: true});
        return new ImportPageStep1();
    }

    clickNext(): ImportPageStep3 {
        cy.get(`[test-button-step2-next]`).click({force: true});
        return new ImportPageStep3();
    }


    selectImportType(type: 'ATTRIBUTE' | 'ITEM' | 'PRICE'): ImportPageStep2 {
        cy.get(`[test-mat-select-step2-import-type]`).first().click({force: true});
        cy.get(`[test-mat-select-option-step2-import-type='${type}']`).click({force: true});
        return this;
    }

    uploadFile(fileName: string): ImportPageStep2 {
        cy.fixture(fileName).then(fileContent => {
            return cy.get(`[test-fileupload-step2]`).upload({ fileContent, fileName, mimeType: 'text/csv' });
        });
        return this;
    }
}

export class ImportPageStep3 {
    verifyInStep(): ImportPageStep3 {
        cy.get(`mat-step-header[aria-posinset='3'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    clickNext(): ImportPageStep4 {
        cy.get(`[test-button-step3-next]`).click({force: true});
        return new ImportPageStep4();
    }

    clickBack(): ImportPageStep2 {
        cy.get(`[test-button-step3-back]`).click({force: true});
        return new ImportPageStep2();
    }

    verifyAttributeImport_attributeExists(attributeName: string, attributeType: AttributeType): ImportPageStep3 {
        cy.get(`[test-table-step3-attribute]`)
            .find(`[test-table-row='${attributeName}']`)
            .find(`[test-table-column-attribute-name]`).should('have.attr', 'test-table-column-attribute-name', attributeName);
        cy.get(`[test-table-step3-attribute]`)
            .find(`[test-table-row='${attributeName}']`)
            .find(`[test-table-column-attribute-type]`).should ('have.attr', 'test-table-column-attribute-type', attributeType)
        return this;
    }

    verifyItemImport_itemExists(itemName: string): ImportPageStep3 {
        cy.get(`[test-table-step3-item]`)
            .find(`[test-table-row='${itemName}']`).should('have.attr', 'test-table-row', itemName);
        return this;
    }

    expandItem(itemName: string): ImportPageStep3 {
        cy.get(`[test-table-step3-item]`)
            .find(`[test-table-row='${itemName}']`).then((_) => {
                const l = _.find(`[test-row-isExpanded='false']`).length;
                if (l > 0) {
                    return cy.get(`[test-table-step3-item]`)
                        .find(`[test-table-row='${itemName}']`)
                        .find(`[test-row-isExpanded]`)
                        .click({force: true});
                }
                return cy.wait(1000);
        });
        return this;
    }

    verifyItemImport_itemAttributeValue(itemName: string, attributeName: string, values: string[]): ImportPageStep3 {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-table-step3-item]`)
                .find(`[test-table-row='${itemName}']`)
                .find(`[test-table-column-attribute='${attributeName}']`)
                .should('contain.text', values[i]);
        });
        return this;
    }

    verifyItemImport_itemVisible(itemName: string, b: boolean): ImportPageStep3 {
        cy.get(`[test-table-step3-item]`)
            .find(`[test-table-row='${itemName}']`).should(b ? 'be.visible' : 'not.be.visible');
        return this;
    }

    verifyPriceImport_price(itemName: string, values: string[]): ImportPageStep3 {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-table-step3-price]`)
                .find(`[test-table-row='${itemName}']`)
                .find(`[test-table-column-price]`)
                .should('contain.text', values[i]);
        });
        return this;
    }

    verifyPriceImport_priceUnit(itemName: string, values: string[]): ImportPageStep3 {
        cy.wrap(values).each((e, i, a) => {
            return cy.get(`[test-table-step3-price]`)
                .find(`[test-table-row='${itemName}']`)
                .find(`[test-table-column-price-unit]`)
                .should('contain.text', values[i]);
        });
        return this;
    }
}

export class ImportPageStep4 {
    verifyInStep(): ImportPageStep4 {
        cy.get(`mat-step-header[aria-posinset='4'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    clickDone(): ImportPageStep1 {
        cy.get(`[test-button-step4-done]`).click({force: true});
        return new ImportPageStep1();
    }

}
