import {LoginPage} from "./page-object/login.page";
import {ViewDataThumbnailPage} from "./page-object/sub-page-object/view-data-thumbnail.page";


describe('view-data-thumbnail spec', () => {

    let viewDataThumbnailPage: ViewDataThumbnailPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataThumbnailPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewDataTable();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        viewDataThumbnailPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataThumbnailPage
            .visit()
            .validateTitle()
        ;
    });
});