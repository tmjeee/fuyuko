import {LoginPage} from "./page-object/login.page";
import {PartnerPage} from "./page-object/partner.page";
import {PartnerTablePage} from "./page-object/sub-page-object/partner-table.page";


describe('partner table spec', () => {

    let partnerPage: PartnerPage;
    let partnerTablePage: PartnerTablePage;


    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');

        // create new view
        partnerPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitPartnerPage()
        ;
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        partnerTablePage = partnerPage.visitPartnerTablePage();
        cy.wait(1000);
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        partnerPage
            .visitPartnerTablePage()
            .validateTitle()
        ;
    });

    //////////////////

    it(`can expand row`, () => {

        partnerTablePage
            .expandItem(`Item-1`)
            .verifyItemVisible(`Item-1-1`)
            .verifyItemVisible(`Item-1-2`)
            .collapseItem(`Item-1`)
            .verifyItemNotVisible(`Item-1-1`)
            .verifyItemNotVisible(`Item-1-2`)
        ;
    });

    it(`can show attribute and item info side menu`, () => {
        partnerTablePage
            .clickOnShowAttributeIcon(`Item-1`)
            .verifyAttributeSideMenuVisible()
            .verifyAttributeSideMenuItemName(`Item-1`)
            .verifyAttributeSideNenuItemPrice(`1.10`)
            .clickOnShowAttributeIcon(`Item-2`)
            .verifyAttributeSideMenuVisible()
            .verifyAttributeSideMenuItemName(`Item-2`)
        ;
    });

    it(`have the right attribute and values`, () => {

    });
});