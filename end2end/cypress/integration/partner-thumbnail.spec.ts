import {PartnerPage} from "./page-object/partner.page";
import {LoginPage} from "./page-object/login.page";
import {PartnerThubnailPage} from "./page-object/sub-page-object/partner-thumbnail.page";


describe('partner thumbnail spec', () => {

    let partnerPage: PartnerPage;
    let partnerThumbnailPage: PartnerThubnailPage;


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
        partnerThumbnailPage = partnerPage.visitPartnerThumbnailPage();
        cy.wait(1000);
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        partnerPage
            .visitPartnerThumbnailPage()
            .validateTitle()
        ;
    });

    //////////////////




    it(``, () => {

    });
});
