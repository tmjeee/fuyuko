import {PartnerPage} from "./page-object/partner.page";
import {LoginPage} from "./page-object/login.page";
import {PartnerListPage} from "./page-object/sub-page-object/partner-list.page";

describe('partner list spec', () => {

    let partnerPage: PartnerPage;
    let partnerListPage: PartnerListPage;


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
        partnerListPage = partnerPage.visitPartnerListPage();
        cy.wait(1000);
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        partnerPage
            .visitPartnerListPage()
            .validateTitle()
        ;
    });

    //////////////////


    it(``, () => {

    });
});
