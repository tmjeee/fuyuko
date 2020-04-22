import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {cyan} from "color-name";

export class CustomImportPage implements ActualPage<CustomImportPage> {

    validateTitle(): CustomImportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'custom-import');
        return this;
    }

    verifyErrorMessageExists(): CustomImportPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): CustomImportPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    visit(): CustomImportPage {
        cy.visit(`/import-export-gen-layout/(custom-import//help:import-help)`);
        return this;
    }


    clickStep1(): CustomImportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`).click({force: true});
        return new CustomImportPageStep1();
    }
}

export class CustomImportPageStep1 {
    verifyInStep(): CustomImportPageStep1 {
        cy.get(`mat-step-header[aria-posinset='1']`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectCustomImport(customImportName: string): CustomImportPageStep1 {
        cy.get(`[test-step='step1']`)
            .find(`[test-row='${customImportName}']`)
            .find(`[test-radio-custom-data-import] label`)
            .click({force: true});
        return this;
    }

    verifyCustomImportSelected(customImportName: string): CustomImportPageStep1 {
        cy.get(`[test-step='step1']`)
            .find(`[test-row='${customImportName}']`)
            .find(`[test-radio-custom-data-import='${customImportName}']`)
            .should('exist');
        return this;
    }

    verifyCanClickNext(b: boolean): CustomImportPageStep1 {
        cy.get(`[test-step='step1']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): CustomImportPageStep2 {
        cy.get(`[test-step='step1']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomImportPageStep2();
    }
}

export class CustomImportPageStep2 {
    verifyInStep(): CustomImportPageStep2 {
        cy.get(`mat-step-header[aria-posinset='2']`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    selectView(viewName: string): CustomImportPageStep2 {
        cy.get(`[test-step='step2']`)
            .find(`[test-mat-select-view]`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-view='${viewName}']`)
            .click({force: true});
        return this;
    }

    verifyCanClickNext(b: boolean): CustomImportPageStep2 {
        cy.get(`[test-step='step2']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): CustomImportPageStep3 {
        cy.get(`[test-step='step2']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomImportPageStep3();
    }
}

export class CustomImportPageStep3 {
    verifyInStep(): CustomImportPageStep3 {
        cy.get(`mat-step-header[aria-posinset='3']`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    editStringInputValue(inputName: string, value: string): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='string'][test-input-name='${inputName}']`)
            .type(value, {force: true});
        return this;
    }

    verifyStringInputValue(inputName: string, value: string): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='string'][test-input-name='${inputName}']`)
            .should('exist')
            .should('have.value', value);
        return this;
    }

    editNumberInputValue(inputName: string, value: string): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='number'][test-input-name='${inputName}']`)
            .type(value, {force: true});
        return this;
    }

    verifyNumberInputValue(inputName: string, value: string): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='number'][test-input-name='${inputName}']`)
            .should('exist')
            .should('have.value', value);
        return this;
    }

    editDateInputValue(inputName: string, value: string /* DD-MM-YYYY */) : CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='date'][test-input-name='${inputName}']`)
            .type(value, {force: true})
        return this;
    }

    verifyDateInputValue(inputName: string, value: string /* DD-MM-YYYY */ ): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='date'][test-input-name]='${inputName}']`)
            .should('exist')
            .should('have.value', value);
        return this;
    }

    editCheckboxValue(inputName: string, value: boolean): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`).then((_) => {
            const length = _.find(`[test-input-type='date'][test-input-name='${inputName}'].mat-checkbox-checked`).length;
            if (length <= 0 && value) { // not already checked and we want to check it
                return cy.get(`[test-input-type='checkbox'][test-input-name='${inputName}'] label`).click({force: true});
            } else if (length > 0 && !value) { // already checked and we want to uncheck it
                return cy.get(`[test-input-type='checkbox'][test-input-name='${inputName}'] label`).click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    verifyCheckboxValue(inputName: string, b: boolean) : CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='checkbox'][test-input-name='${inputName}'].mat-checkbox-checked`)
            .should( b ?  'have.length.gt' : 'have.length.lte', 0);
        return this;
    }


    editSelectValue(inputName: string, key: string): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='select'][test-mat-select-input-name='${inputName}']`).first()
            .click({force: true});
        cy.get(`[test-mat-select-option-input-key=${key}]`)
            .click({force: true});
        return this;
    }

    verifySelectValue(inputName: string, key: string): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-input-type='select'][test-mat-select-input-key='${inputName}']`)
            .find(`.mat-select-value`)
            .find(`.mat-select-value-text`)
            .should('have.text', key);
        return this;
    }

    editFileValue(inputName: string, fileName: string, mimeType: string): CustomImportPageStep3 {
        cy.fixture(fileName).then(fileContent => {
            return cy.get(`[test-input-type='file'][test-input-name='${inputName}']`).upload({ fileContent, fileName, mimeType });
        });
        return this;
    }

    verifyFileValue(inputName: string, value: string): CustomImportPageStep3 {
        cy.get(`[test-input-type='file'][test-input-name='${inputName}']`)
            .should('contain.text', value);
        return this;
    }


    verifyCanClickNext(b: boolean): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickSubmit(): CustomImportPageStep3 {
        cy.get(`[test-step='step3']`)
            .find(`[test-button-submit]`).click({force: true});
        return this;
    }

    clickNext(): CustomImportPageStep4 {
        cy.get(`[test-step='step3']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomImportPageStep4();
    }
}

export class CustomImportPageStep4 {
    verifyInStep(): CustomImportPageStep4 {
        cy.get(`mat-step-header[aria-posinset='4']`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    verifyColumnText(rowIndex: number, columnName: string, text: string): CustomImportPageStep4 {
        cy.get(`[test-step='step4']`)
            .find(`[test-row-index='${rowIndex}']`)
            .find(`[test-column='${columnName}']`)
            .should('have.text', text);
        return this;
    }

    verifyCanClickNext(b: boolean): CustomImportPageStep4 {
        cy.get(`[test-step='step4']`)
            .find(`[test-button-next]`)
            .should( b ? 'be.enabled' : 'not.be.enabled');
        return this;
    }

    clickNext(): CustomImportPageStep5 {
        cy.get(`[test-step='step4']`)
            .find(`[test-button-next]`)
            .click({force: true});
        return new CustomImportPageStep5;
    }
}

export class CustomImportPageStep5 {
    verifyInStep(): CustomImportPageStep5 {
        cy.get(`mat-step-header[aria-posinset='5']`)
            .should('have.attr', 'tabindex', '0');
        return this;
    }

    verifyHasNotifications(): CustomImportPageStep5 {
        cy.get(`[test-step='step5']`)
            .find(`[test-notifications]`)
            .should('exist');
        return this;
    }

    clickDone(): CustomImportPageStep1 {
        cy.get(`[test-button-done]`).click({force: true});
        return new CustomImportPageStep1();
    }
}