import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {CustomImportPageStep1, CustomImportPageStep5} from "./custom-import.page";


export class CustomExportPage implements ActualPage<CustomExportPage> {

    validateTitle(): CustomExportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'custom-export');
        return this;
    }

    verifyErrorMessageExists(): CustomExportPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): CustomExportPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    visit(): CustomExportPage {
        cy.visit(`/import-export-gen-layout/(custom-export//help:export-help)`);
        cy.waitUntil(() => cy.get(`[test-custom-export-wizard]`));
        return this;
    }

    waitForReady(): CustomExportPage {
        cy.waitUntil(() => cy.get(`[test-custom-export-wizard]`));
        return this;
    }

    clickStep1(): CustomExportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`).click({force: true});
        return new CustomExportPageStep1();
    }
}


export class CustomExportPageStep1 {

    verifyInStep(): CustomExportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectCustomExport(customExportName: string): CustomExportPageStep1 {
        cy.get(`[test-step='step1']`)
            .find(`[test-row='${customExportName}']`)
            .find(`[test-radio-custom-data-export] label`)
            .click({force: true});
        return this;
    }

    verifyCustomExportSelected(customExportName: string): CustomExportPageStep1 {
        cy.get(`[test-step='step1']`)
            .find(`[test-row='${customExportName}']`)
            .find(`[test-radio-custom-data-export='${customExportName}']`)
            .should('exist');
        return this;
    }

    verifyCanClickNext(b: boolean): CustomExportPageStep1 {
        cy.get(`[test-step='step1']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): CustomExportPageStep2 {
        cy.get(`[test-step='step1']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomExportPageStep2();
    }
}

export class CustomExportPageStep2 {

    verifyInStep(): CustomExportPageStep2 {
        cy.get(`mat-step-header[aria-posinset='2'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectView(viewName: string): CustomExportPageStep2 {
        cy.get(`[test-step='step2']`)
            .find(`[test-mat-select-view]`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-view='${viewName}']`)
            .click({force: true});
        return this;
    }

    verifyCanClickNext(b: boolean): CustomExportPageStep2 {
        cy.get(`[test-step='step2']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): CustomExportPageStep3 {
        cy.get(`[test-step='step2']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomExportPageStep3();
    }
}

export class CustomExportPageStep3 {
    verifyInStep(): CustomExportPageStep3 {
        cy.get(`mat-step-header[aria-posinset='3'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    editStringInputValue(inputName: string, value: string): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='string'][test-input-name='${inputName}']`)
            .type(value, {force: true});
        return this;
    }

    verifyStringInputValue(inputName: string, value: string): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='string'][test-input-name='${inputName}']`)
            .should('exist')
            .should('have.value', value);
        return this;
    }

    editNumberInputValue(inputName: string, value: string): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='number'][test-input-name='${inputName}']`)
            .type(value, {force: true});
        return this;
    }

    verifyNumberInputValue(inputName: string, value: string): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='number'][test-input-name='${inputName}']`)
            .should('exist')
            .should('have.value', value);
        return this;
    }

    editDateInputValue(inputName: string, value: string /* DD-MM-YYYY */) : CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='date'][test-input-name='${inputName}']`)
            .type(value, {force: true})
        return this;
    }

    verifyDateInputValue(inputName: string, value: string /* DD-MM-YYYY */ ): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='date'][test-input-name]='${inputName}']`)
            .should('exist')
            .should('have.value', value);
        return this;
    }

    editCheckboxValue(inputName: string, value: boolean): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`).then((_) => {
            const length = _.find(`[test-input-type='date'][test-input-name='${inputName}'].mat-checkbox-checked`).length;
            if (length <= 0 && value) { // not already checked and we want to check it
                return cy.get(`[test-input-type='checkbox'][test-input-name='${inputName}'] label`).click({force: true});
            } else if (length > 0 && !value) { // already checked and we want to uncheck it
                return cy.get(`[test-input-type='checkbox'][test-input-name='${inputName}'] label`).click({force: true});
            }
        });
        return this;
    }

    verifyCheckboxValue(inputName: string, b: boolean) : CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='checkbox'][test-input-name='${inputName}'].mat-checkbox-checked`)
            .should( b ?  'have.length.gt' : 'have.length.lte', 0);
        return this;
    }


    editSelectValue(inputName: string, key: string): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='select'][test-mat-select-input-name='${inputName}']`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-input-key=${key}]`)
            .click({force: true});
        return this;
    }

    verifySelectValue(inputName: string, key: string): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='select'][test-mat-select-input-key='${inputName}']`)
            .find(`.mat-select-value`)
            .find(`.mat-select-value-text`)
            .should('have.text', key);
        return this;
    }

    editFileValue(inputName: string, fileName: string, mimeType: string): CustomExportPageStep3 {
        cy.fixture(fileName).then(fileContent => {
            return cy.get(`[test-input-type='file'][test-input-name='${inputName}']`).upload({ fileContent, fileName, mimeType });
        });
        return this;
    }

    verifyFileValue(inputName: string, value: string): CustomExportPageStep3 {
        cy.get(`[test-input-type='file'][test-input-name='${inputName}']`)
            .should('contain.text', value);
        return this;
    }


    verifyCanClickNext(b: boolean): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickSubmit(): CustomExportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-button-submit]`).click({force: true});
        return this;
    }

    clickNext(): CustomExportPageStep4 {
        cy.get(`[test-step='step3']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomExportPageStep4();
    }
}

export class CustomExportPageStep4 {
    verifyInStep(): CustomExportPageStep4 {
        cy.get(`mat-step-header[aria-posinset='4'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }
    verifyColumnText(rowIndex: number, columnName: string, text: string): CustomExportPageStep4 {
        cy.get(`[test-step='step4']`)
            .find(`[test-row-index='${rowIndex}']`)
            .find(`[test-column='${columnName}']`)
            .should('have.text', text);
        return this;
    }

    verifyCanClickNext(b: boolean): CustomExportPageStep4 {
        cy.get(`[test-step='step4']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): CustomExportPageStep5 {
        cy.get(`[test-step='step4']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomExportPageStep5;
    }
}

export class CustomExportPageStep5 {
    verifyInStep(): CustomExportPageStep5 {
        cy.get(`mat-step-header[aria-posinset='5'`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    verifyHasNotifications(): CustomExportPageStep5 {
        cy.get(`[test-step='step5']`)
            .find(`[test-notifications]`)
            .should('exist');
        return this;
    }

    clickDone(): CustomExportPageStep1 {
        cy.get(`[test-button-done]`).click({force: true});
        return new CustomExportPageStep1();
    }
}
