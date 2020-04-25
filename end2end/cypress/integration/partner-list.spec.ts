import {PartnerPage} from "./page-object/partner.page";
import {LoginPage} from "./page-object/login.page";
import {PartnerListPage} from "./page-object/sub-page-object/partner-list.page";

describe('partner list spec', () => {

    let partnerPage: PartnerPage;
    let partnerListPage: PartnerListPage;


    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // partnerPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitPartnerPage()
        // ;
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        partnerPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitPartnerPage()
        ;
        partnerListPage = partnerPage.visitPartnerListPage();
        // cy.wait(1000);
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        partnerPage
            .visitPartnerListPage()
            .validateTitle()
        ;
    });

    //////////////////


    it(`should expand and collapse item list`, () => {
        partnerListPage
            .selectPricingStructure(`Test View 1`, `Pricing Structure #1`)
            .verifyItemExpanded(`Item-1`, false)
            .selectItemInList(`Item-1`)
            .verifyItemExpanded(`Item-1`, true)
            .verifyItemExpanded(`Item-2`, false)
            .verifyItemName(`Item-1`)
            .verifyItemPrice(`Item-1`, `$1.10`)
            .clickNextImage(`Item-1`)
            .clickNextImage(`Item-1`)
            .clickPreviousImage(`Item-1`)
    });

    it('should show / hide side attributes panel', () => {
        partnerListPage
            .selectPricingStructure(`Test View 1`, `Pricing Structure #1`)
            .selectItemInList(`Item-1`)
            .verifyItemExpanded(`Item-1`, true)
            .verifyItemSideMenuOpened(false)
            .showItemAttributeSideMenu(`Item-1`)
            .verifyItemSideMenuOpened(true)
            .verifyItemSideMenuItemName(`Item-1`)
            .verifyItemSideMenuItemPrice(`$1.10`)
            .verifyItemSideMenuAttributeValue(`string attribute`, [`some`, `string`, `Item-1`])
            .verifyItemSideMenuAttributeValue(`text attribute`, [`some`, `text`, `Item-1`])

            .selectItemInList(`Item-2`)
            .verifyItemExpanded(`Item-2`, true)
            .closeItemAttributeSideMenu()
            .verifyItemSideMenuOpened(false)
            .showItemAttributeSideMenu(`Item-2`)
            .verifyItemSideMenuOpened(true)
            .verifyItemSideMenuItemName(`Item-2`)
            .verifyItemSideMenuItemPrice(`$2.20`)
            .verifyItemSideMenuAttributeValue(`string attribute`, [`some`, `string`, `Item-2`])
            .verifyItemSideMenuAttributeValue(`text attribute`, [`some`, `text`, `Item-2`])
        ;
    });

});
