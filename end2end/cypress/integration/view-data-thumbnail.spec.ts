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
            .visitViewDataThumbnail();
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

    it('should be searchable (basic search)', () => {
        viewDataThumbnailPage
            .doBasicSearch(`Item-2`)
            .verifyThumbnailsResultSize(1)
            .verifyThumbnailsHasItem(`Item-2`, true)
            .doBasicSearch('asdsdsdsdsdsdsdsds')
            .verifyThumbnailsResultSize(0)
            .verifyThumbnailsHasItem('asdsdsdsdsdsdsdsds', false)
        ;
    });

    it('should add / delete thumbnail', () => {
        const itemName = `Test-Item-${Math.random()}`;
        viewDataThumbnailPage
            .clickAddThumbnail(itemName)
            .verifyThumbnailsHasItem(itemName, true)
            .clickDeleteThumnail([itemName])
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });

    it('should change name / description of thumbnail', ()=> {
        const itemName = `Test-Item-${Math.random()}`;
        const newItemName = `New-Test-Item-${Math.random()}`;
        viewDataThumbnailPage
            .clickAddThumbnail(itemName)
            .clickThumbnailItemName(itemName)
            .verifyPopupTitle()
            .editItemName(newItemName)
            .clickOk()
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });

});
