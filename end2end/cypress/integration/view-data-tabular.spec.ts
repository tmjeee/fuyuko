import {LoginPage} from "./page-object/login.page";
import {ViewDataTablePage} from "./page-object/sub-page-object/view-data-table.page";

describe('view attribute spec', () => {
    const attrs = [
        'string attribute',
    ];

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

    it.only(`should do column filtering and ordering`, () => {
        viewDataTablePage
            .selectBasicSearch()
            .openFilterBox()
            .verifyFilterBoxOpen(true)
            .closeFilterBox()
            .verifyFilterBoxOpen(false)
        ;

        cy.wrap(attrs).each((e, i, a) => {
            viewDataTablePage
                .openFilterBox()
                .checkFilterCheckbox(attrs[i], false)
                .verifyAttributeCellExists(attrs[i], false)
                .checkFilterCheckbox(attrs[i], true)
                .verifyAttributeCellExists(attrs[i], true)
        });
        /*
        cy.wrap(attrs).each((e, i, a) => {
            if (i == (a.length - 1)) { // the last, move up then down
                viewDataTablePage
                    .moveAttributeFilterOrderUp(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i-1)
                    .moveAttributeFilterOrderDown(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i)
            } else { // the rest, move down then up
                viewDataTablePage
                    .moveAttributeFilterOrderDown(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i+1)
                    .moveAttributeFilterOrderUp(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i)
            }
        });
         */

    });

    it ('should allow editing items (nested)', () => {
        viewDataTablePage
            .clickOnItemAttributeCellToEdit('Item-1', 'string attribute')
            .verifyPopupTitle()
        ;
    });

    it ('should allow adding and deleting items (nested)', () => {

    });
});
