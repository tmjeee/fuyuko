import {LoginPage} from "./page-object/login.page";
import {ViewDataTablePage} from "./page-object/sub-page-object/view-data-table.page";

describe('view attribute spec', () => {

    let viewDataTablePage: ViewDataTablePage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataTablePage = new LoginPage()
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
        viewDataTablePage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataTablePage
            .visit()
            .validateTitle()
        ;
    });

    it('should be searchable (basic search)', () => {
        viewDataTablePage
            .doBasicSearch(`Item-2`)
            .verifyDataTableResultSize(1)
            .verifyDataTableHasItem(`Item-2`, true)
            .doBasicSearch('asdsdsdsdsdsdsdsds')
            .verifyDataTableResultSize(0)
            .verifyDataTableHasItem('asdsdsdsdsdsdsdsds', false)
        ;
    });

    it(`should do column filtering and ordering`, () => {
        viewDataTablePage
            .openFilterBox()
            .verifyFilterBoxOpen(true)
            .closeFilterBox()
            .verifyFilterBoxOpen(true)
            .openFilterBox()
            .checkFilterCheckbox(`string attribute`, true)

    });
});
