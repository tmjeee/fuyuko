import {ViewDataThumbnailAttributePopupPage} from "./view-data-thumbnail-attribute-popup.page";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {ViewDataThumbnailItemPopupPage} from "./view-data-thumbnail-item-popup.page";
import {AbstractViewDataAttributePopupPage} from "./abstract-view-data-attribute-popup.page";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";


export abstract class AbstractViewDataEditPopupPage {

    abstract createAbstractViewDataAttributePopupPage(): AbstractViewDataAttributePopupPage;
    abstract createAbstractViewDataItemPopupPage(): AbstractViewDataItemPopupPage;

    verifyPopupTitle(): AbstractViewDataEditPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editStringAttribute(attributeName: string, v: string): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})

        const e = this.createAbstractViewDataAttributePopupPage();
        e.editStringAttribute(v);
        return e;
    }

    editTextAttribute(attributeName: string, v: string): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})

        const e = this.createAbstractViewDataAttributePopupPage();
        e.editTextAttribute(v);
        return e;
    }

    editNumericAttribute(attributeName: string, v: number): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editNumericAttribute(v);
        return e;
    }

    editDateAttribute(attributeName: string, v: string /* DD-MM-YYYY */): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editDateAttribute(v);
        return e;
    }

    editCurrencyAttribute(attributeName: string, v: number, unit: CountryCurrencyUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editCurrencyAttribute(v, unit);
        return e;
    }

    editAreaAttribute(attributeName: string, v: number, unit: AreaUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editAreaAttribute(v, unit);
        return e;
    }

    editVolumeAttribute(attributeName: string, v: number, unit: VolumeUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editVolumeAttribute(v, unit);
        return e;
    }

    editDimensionAttribute(attributeName: string, l: number, w: number, h: number, unit: DimensionUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editDimensionAttribute(l, w, h, unit);
        return e;
    }

    editWidthAttribute(attributeName: string, v: number, unit: WidthUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editWidthAttribute(v, unit);
        return e;
    }

    editLengthAttribute(attributeName: string, v: number, unit: LengthUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editLengthAttribute(v, unit);
        return e;
    }

    editHeightAttribute(attributeName: string, v: number, unit: HeightUnits): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editHeightAttribute(v, unit);
        return e;
    }

    editSelectAttribute(attributeName: string, key: string): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editSelectAttribute(key);
        return e;
    }

    editDoubleSelectAttribute(attributeName: string, key1: string, key2: string): AbstractViewDataAttributePopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-data-editor='${attributeName}']`)
            .find(`[test-data-editor-value='${attributeName}']`)
            .click({force: true})
        const e = this.createAbstractViewDataAttributePopupPage();
        e.editDoubleSelectAttribute(key1, key2);
        return e;
    }


    editItemName(name: string) : AbstractViewDataItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-item-editor='name']`)
            .find(`[test-item-editor-value='name']`)
            .click({force: true});

        const e = this.createAbstractViewDataItemPopupPage();
        e.editItemName(name)
        return e;
    }

    editItemDescription(description: string): AbstractViewDataItemPopupPage {
        cy.get(`[test-popup-dialog-title='item-data-editor-dialog-popup']`)
            .find(`[test-item-editor='description']`)
            .find(`[test-item-editor-value='description']`)
            .click({force: true});

        const e = this.createAbstractViewDataItemPopupPage();
        e.editItemDescription(description)
        return e;
    }
}
