import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

const PAGE_NAME = 'partner-thumbnail'
export class PartnerThumbnailPage implements ActualPage<PartnerThumbnailPage> {

    validateTitle(): PartnerThumbnailPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
        return this;
    }

    visit(): PartnerThumbnailPage {
        cy.visit('/partner-layout/(thumbnail//help:partner-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): PartnerThumbnailPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    verifyErrorMessageExists(): PartnerThumbnailPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): PartnerThumbnailPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    ////////////////////////////////////////////

    selectPricingStructure(viewName: string, pricingStructureName: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-mat-select-pricing-structure]`)).first()
            .click({force: true});
        cy.waitUntil(() => cy.get(`[test-mat-select-option-pricing-structure='${viewName}-${pricingStructureName}']`))
            .click({force: true});
        cy.wait(100);
        return this;
    }


    clickShowMoreLink(itemName: string) : PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']`))
            .then((_) => {
            const l = _.find(`[test-show-more-link]`).length;
            if (l > 0) {
                cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
                   [test-item='${itemName}']
                   [test-show-more-link]`))
                   .click({force: true})
            }
            return cy.wait(1000);
        });
        return this;
    }

    clickShowLessLink(itemName: string) : PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']`))
            .then((_) => {
            const l = _.find(`[test-show-less-link`).length;
            if (l > 0) {
                cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
                    [test-item='${itemName}']
                    [test-show-less-link]`))
                    .click({force: true})
            }
            return cy.wait(1000);
        });
        return this;
    }

    verifyIsShowMoreExpanded(itemName: string, b: boolean): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']`)).then((n) => {
                cy.wrap(n).get(`[test-show-less-link]`)
                    .should(b ? 'exist' : 'not.exist'); // if it is in 'show more' aready, 'show-less' should exists
            });
        return this;
    }

    verifyItemName(itemName: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']
            [test-item-name=${itemName}]`))
            .should('exist');
        return this;
    }

    verifyItemPrice(itemName: string, price: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']
            [test-item-price='${itemName}']`))
            .should('contain.text', price);
        return this;
    }

    verifyItemAttributeValue(itemName: string, attributeName: string, values: string[]): PartnerThumbnailPage {
        cy.wrap(values).each((e, i , a) => {
            return cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
                [test-item='${itemName}']
                [test-attribute-value='${attributeName}']`))
                .should('contain.text', values[i]);
        });
        return this;
    }

    clickNextItemImage(itemName: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']
            [test-carousel]
            [test-button-next-image]`))
            .click({force:true});
        return this;
    }

    clickPreviousItemImage(itemName: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']
            [test-carousel]
            [test-button-previous-image]`))
            .click({force:true});
        return this;
    }

    clickShowSideMenu(itemName: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-item='${itemName}']
            [test-icon-item-details='${itemName}']`))
            .click({force: true})
        return this;
    }

    clickCloseSideMenu(): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]`)).then((_) => {
            const l = _.find(`[test-icon-close-item-details]`).length;
            if (l > 0) {
                cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
                    [test-icon-close-item-details]`))
                    .click({force: true});
            }
            return cy.wait(1000);
        });
        return this;
    }

    verifySideMenuVisible(b: boolean) : PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-side-nav]`))
            .should(b ? 'be.visible': 'not.be.visible');
        return this;
    }

    verifySideMenuItemName(itemName: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-side-nav]
            [test-info-name='Name']`))
            .should('contain.text', itemName);
        return this;
    }

    verifySideMenuItemPrice(price: string): PartnerThumbnailPage {
        cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
            [test-side-nav]
            [test-info-name='Price']`))
            .should('contain.text', price);
        return this;
    }

    verifySideMenuAttributeValue(attributeName: string, values: string[]): PartnerThumbnailPage {
        cy.wrap(values).each((e, i, a) => {
            return cy.waitUntil(() => cy.get(`[test-partner-data-thumbnail]
                [test-side-nav]
                [test-cell-attribute='${attributeName}']`))
                .should('contain.text', values[i]);
        });
        return this;
    }
}
