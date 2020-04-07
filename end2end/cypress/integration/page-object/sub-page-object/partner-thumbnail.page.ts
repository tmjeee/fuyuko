import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class PartnerThumbnailPage implements ActualPage<PartnerThumbnailPage> {

    validateTitle(): PartnerThumbnailPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'partner-thumbnail');
        return this;
    }

    visit(): PartnerThumbnailPage {
        cy.visit('/partner-layout/(thumbnail//help:partner-help)');
        return this;
    }

    verifyErrorMessageExists(): PartnerThumbnailPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): PartnerThumbnailPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    ////////////////////////////////////////////

    selectPricingStructure(pricingStructureName: string): PartnerThumbnailPage {
        cy.get(`[test-mat-select-pricing-structure] div`)
            .click({force: true, multiple: true});
        cy.get(`[test-mat-select-option-pricing-structure='${pricingStructureName}']`)
            .click({force: true});
        cy.wait(100);
        return this;
    }


    clickShowMoreLink(itemName: string) : PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .then((_) => {
            const l = _.find(`[test-show-more-link]`).length;
            if (l > 0) {
                cy.get(`[test-partner-data-thumbnail]`)
                    .find(`[test-item='${itemName}']`)
                    .find(`[test-show-more-link]`)
                    .click({force: true})
            }
        });
        return this;
    }

    clickShowLessLink(itemName: string) : PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .then((_) => {
            const l = _.find(`[test-show-less-link`).length;
            if (l > 0) {
                cy.get(`[test-partner-data-thumbnail]`)
                    .find(`[test-item='${itemName}']`)
                    .find(`[test-show-less-link]`)
                    .click({force: true})
            }
        });
        return this;
    }

    verifyIsShowMoreExpanded(itemName: string, b: boolean): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-show-less-link]`)
            .should(b ? 'exist' : 'not.exist'); // if it is in 'show more' aready, 'show-less' should exists
        return this;
    }

    verifyItemName(itemName: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-item-name=${itemName}]`)
            .should('exist');
        return this;
    }

    verifyItemPrice(itemName: string, price: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-item-price='${itemName}']`)
            .should('contain.text', price);
        return this;
    }

    verifyItemAttributeValue(itemName: string, attributeName: string, value: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-attribute-value='${attributeName}']`)
            .should('contain.text', value);
        return this;
    }

    clickNextItemImage(itemName: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-carousel]`)
            .find(`[test-button-next-image]`)
            .click({force:true});
        return this;
    }

    clickPreviousItemImage(itemName: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-carousel]`)
            .find(`[test-button-previous-image]`)
            .click({force:true});
        return this;
    }

    clickShowSideMenu(itemName: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-item='${itemName}']`)
            .find(`[test-icon-item-details='${itemName}']`)
            .click({force: true})
        return this;
    }

    clickCloseSideMenu(): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`).then((_) => {
            const l = _.find(`[test-icon-close-item-details]`).length;
            if (l > 0) {
                cy.get(`[test-partner-data-thumbnail]`)
                    .find(`[test-icon-close-item-details]`)
                    .click({force: true});
            }
        });
        return this;
    }

    verifySideMenuVisible(b: boolean) : PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-side-nav]`)
            .should(b ? 'be.visible': 'not.be.visible');
        return this;
    }

    verifySideMenuItemName(itemName: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-side-nav]`)
            .find(`[test-info-name='Name']`)
            .should('contain.text', itemName);
        return this;
    }

    verifySideMenuItemPrice(price: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-side-nav]`)
            .find(`[test-info-name='Price']`)
            .should('contain.text', price);
        return this;
    }

    verifySideMenuAttributeValue(attributeName: string, value: string): PartnerThumbnailPage {
        cy.get(`[test-partner-data-thumbnail]`)
            .find(`[test-side-nav]`)
            .find(`[test-cell-attribute='${attributeName}']`)
            .should('contain.text', value);
        return this;
    }
}
