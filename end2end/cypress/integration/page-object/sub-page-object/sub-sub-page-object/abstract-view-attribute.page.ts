import * as util from "../../../util/util";
import {AttributeType} from "../../../model/attribute.model";
import {ViewAttributePage} from "../view-attribute.page";


export class AbstractViewAttributePage {

    verifyErrorMessageExists(): AbstractViewAttributePage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): AbstractViewAttributePage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    /////


    fillInAttributeName(name: string): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-field-attribute-name]`))
            .clear({force: true})
            .type(name, {force: true});
        return this;
    }

    verifyAttributeNameFilledIn(name: string): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-field-attribute-name]`))
            .should('have.value', name);
        return this;
    }

    fillInAttributeDescription(description: string): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-field-attribute-description]`))
            .clear({force: true})
            .type(description, {force: true});
        return this;
    }

    verifyAttributeDescriptionFilledIn(description: string): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-field-attribute-description]`))
            .should('have.value', description);
        return this;
    }

    selectAttributeType(attributeType: AttributeType): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-select-attribute-type]`))
            .click({force: true});
        cy.waitUntil(() => cy.get(`[test-select-option-attribute-type='${attributeType}']`))
            .click({force: true});
        return this;
    }

    verifyAttributeTypeSelected(attributeType: AttributeType): AbstractViewAttributePage {
        cy.get(`[test-current-selected-attribute-type='${attributeType}']`)
            .should('exist');
        return this;
    }

    fillInForStringAttribute(): AbstractViewAttributePage {
        this.selectAttributeType('string');
        return this;
    }

    fillInForTextAttribute(): AbstractViewAttributePage {
        this.selectAttributeType('text')
        return this;
    }

    fillInForNumberAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('number');
        cy.waitUntil(() => cy.get(`[test-field-number-format]`)).clear({force: true}).type(format, {force: true})
        return this;
    }

    fillInForDateAttribute(format: string = 'DD-MM-YYYY'): AbstractViewAttributePage {
        this.selectAttributeType('date');
        cy.waitUntil(() => cy.get(`[test-field-date-format]`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForCurrencyAttribute(country: boolean = true): AbstractViewAttributePage {
        this.selectAttributeType('currency');
        cy.wrap(country).then((b) => {
            if (b) {
                cy.waitUntil(() => cy.get(`[test-radio-option-enable-country`)).then((_) => {
                    if (!_.hasClass('mat-radio-checked')) {
                        cy.waitUntil(() => cy.get(`[test-radio-option-enable-country]
                            label .mat-radio-container`)).first()
                            .click({force: true});
                    }
                })
            }
            return cy.wait(1000);
        })
        return this;
    }

    fillInForDimensionAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('dimension');
        cy.waitUntil(() => cy.get(`[test-field-dimension-format]`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForVolumeAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('volume');
        cy.waitUntil(() => cy.get(`[test-field-volume-format]`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForAreaAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('area');
        cy.waitUntil(() => cy.get(`[test-field-area-format`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForWidthAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('width');
        cy.waitUntil(() => cy.get(`[test-field-width-format`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForHeightAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('height');
        cy.waitUntil(() => cy.get(`[test-field-height-format`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForLengthAttribute(format: string = '0.0'): AbstractViewAttributePage {
        this.selectAttributeType('length');
        cy.waitUntil(() => cy.get(`[test-field-length-format`)).clear({force: true}).type(format, {force: true});
        return this;
    }

    fillInForSelectAttribute(kvs: {key: string, value: string}[]): AbstractViewAttributePage {
        this.selectAttributeType('select');
        cy.wrap(kvs).each((e, i, a) => {
            cy.waitUntil(() => cy.get('body')).then(($body) => {
                if (!$body.find(`[test-select-key='${i}']`).length) {  // not already exists
                    cy.waitUntil(() => cy.get(`[test-button-add-kp]`)).click({force:true});
                }
                return cy.wait(1000);
            });
            cy.waitUntil(() => cy.get(`[test-select-key='${i}']`)).clear({force: true}).type(kvs[i].key, {force: true});
            cy.waitUntil(() => cy.get(`[test-select-value='${i}']`)).clear({force: true}).type(kvs[i].value, {force: true});
            return cy.wait(1000);
        });
        return this;
    }

    fillInForDoubleSelectAttribute(kvs: {key: string, value: string, entries: {key2: string, value2: string}[]}[]): AbstractViewAttributePage {
        this.selectAttributeType('doubleselect');
        cy.wrap(kvs).each((e, i, a) => {
            cy.waitUntil(() => cy.get('body')).then(($body) => {
                if (!$body.find(`[test-doubleselect-key1='${i}']`).length) { // not already exists
                    cy.waitUntil(() => cy.get(`[test-button-add-kp1]`)).click({force:true});
                }
                return cy.wait(1000);
            });
            cy.waitUntil(() => cy.get(`[test-doubleselect-key1='${i}']`)).clear({force: true}).type(kvs[i].key, {force: true});
            cy.waitUntil(() => cy.get(`[test-doubleselect-value1='${i}']`)).clear({force: true}).type(kvs[i].value, {force: true});
            cy.wrap(kvs[i].entries).each((e2, i2, a2) => {
                cy.waitUntil(() => cy.get('body')).then(($body) => {
                    if (!$body.find(`[test-doubleselect-key2-1='${i2}']`).length) {  // not already exists
                        cy.waitUntil(() => cy.get(`[test-button-add-kp2]`)).click({force: true});
                    }
                    return cy.wait(1000);
                });
                cy.waitUntil(() => cy.get(`[test-doubleselect-key2-1='${i2}']`)).clear({force: true}).type(kvs[i].key, {force: true});
                cy.waitUntil(() => cy.get(`[test-doubleselect-key2-2='${i2}']`)).clear({force: true}).type(kvs[i].entries[i2].key2, {force: true});
                cy.waitUntil(() => cy.get(`[test-doubleselect-value2='${i2}']`)).clear({force: true}).type(kvs[i].entries[i2].value2, {force: true});
                return cy.wait(1000);
            });
            return cy.wait(1000);
        });
        return this;
    }

    verifyCanClickDone(): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-button-done]`)).should('be.enabled');
        return this;
    }

    clickDone(): AbstractViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-button-done]`)).click({force: true});
        return this;
    }

    clickBack(): ViewAttributePage {
        cy.waitUntil(() => cy.get(`[test-button-back]`)).click({force: true});
        return new ViewAttributePage();
    }
}