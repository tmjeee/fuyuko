import {LoginPage} from "./page-object/login.page";
import {ViewDataListPage} from "./page-object/sub-page-object/view-data-list.page";


describe(`view-data-list spec`, () => {

    let viewDataListPage: ViewDataListPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataListPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewDataList();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        viewDataListPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataListPage
            .visit()
            .validateTitle()
        ;
    });

    it.only ('should expand and collapse panel', () => {
        const itemName  = `Item-2`;
        viewDataListPage
            .clickOnPanel(itemName)
            .verifyPanelExpanded(itemName)
            .clickOnPanel(itemName)
            .verifyPanelCollapsed(itemName)
        ;
    });


    it('should be searchable (basic search)', () => {
        viewDataListPage
            .doBasicSearch(`Item-2`)
            .verifyListResultSize(1)
            .verifyListHasItem(`Item-2`, true)
            .doBasicSearch('asdsdsdsdsdsdsdsds')
            .verifyListResultSize(0)
            .verifyListHasItem('asdsdsdsdsdsdsdsds', false)
            .doBasicSearch('')
    });
});
