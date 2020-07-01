import {LoginPage} from "../page-object/login.page";
import {ViewDataTablePage} from "../page-object/sub-page-object/view-data-table.page";

describe('view-data-tabular spec', () => {
    const attrs = [
        'string attribute',
        'text attribute',
        'number attribute',
        'date attribute',
        'currency attribute',
        'volume attribute',
        'dimension attribute',
        'area attribute',
        'length attribute',
        'width attribute',
        'height attribute',
        'select attribute',
        'doubleselect attribute',
    ];


    let viewDataTablePage: ViewDataTablePage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // viewDataTablePage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitViewPage()
        //     .visitViewDataTable();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataTablePage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewDataTable()
            .selectGlobalView('Test View 1');
            // .clickReload()
        ;
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataTablePage
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

    it.skip(`should do column filtering`, () => {
        viewDataTablePage
            .selectBasicSearch()
            .openFilterBox()
            .verifyFilterBoxOpen(true)
            .closeFilterBox()
            .verifyFilterBoxOpen(false)
            .openFilterBox()
        ;

        // test check and uncheck attributes filtering box
        cy.wrap(attrs).each((e, i, a) => {
            viewDataTablePage
                .checkFilterCheckbox(attrs[i], false)
                .verifyAttributeCellExists(attrs[i], false)
                .checkFilterCheckbox(attrs[i], true)
                .verifyAttributeCellExists(attrs[i], true)
            return cy.wait(1000);
        });
    });

    it(`should do column ordering`, () => {
        viewDataTablePage
            .selectBasicSearch()
            .openFilterBox()
            .verifyFilterBoxOpen(true)
            .closeFilterBox()
            .verifyFilterBoxOpen(false)
            .openFilterBox()
        ;

        // test ordering attributes up and down
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
            return cy.wait(1000);
        });
    });

    it.skip(`should add and delete hierachical item (without saving)`, () => {
        const itemName = `ParentItem-${Math.random()}`;
        const itemName2 = `ChildItem-${Math.random()}`;
        const itemName3 = `ChildChildItem-${Math.random()}`;

        viewDataTablePage
            .clickReload()
            .verifySaveEnable(false)
            .clickOnAddItem(itemName)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName, true)
            .clickOnAddChildItem(itemName, itemName2)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName2, true)
            .clickOnAddChildItem(itemName2, itemName3)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName3, true)

            .clickOnDeleteChildItem(itemName3)
            .verifyDataTableHasItem(itemName, true)
            .verifyDataTableHasItem(itemName2, true)
            .verifyDataTableHasItem(itemName3, false)
            .verifyDataTableHasItem('Item-1', true)
            .verifyDataTableHasItem('Item-2', true)
            .verifyDataTableHasItem('Item-3', true)
            .verifyDataTableHasItem('Item-4', true)
            .verifyDataTableHasItem('Item-5', true)
            .verifyDataTableHasItem('Item-6', true)

            .clickOnDeleteChildItem(itemName)
            .verifyDataTableHasItem(itemName, false)
            .verifyDataTableHasItem(itemName2, false)
            .verifyDataTableHasItem(itemName3, false)
            .verifyDataTableHasItem('Item-1', true)
            .verifyDataTableHasItem('Item-2', true)
            .verifyDataTableHasItem('Item-3', true)
            .verifyDataTableHasItem('Item-4', true)
            .verifyDataTableHasItem('Item-5', true)
            .verifyDataTableHasItem('Item-6', true)
        ;
    });


    it(`should add and delete hierarchical item (with saving)`, () => {
        Cypress.currentTest.retries(1);
        const itemName = `ParentItem-${Math.random()}`;
        const itemName2 = `ChildItem-${Math.random()}`;
        const itemName3 = `ChildChildItem-${Math.random()}`;

        viewDataTablePage
            .clickReload()
            .verifySaveEnable(false)
            .clickOnAddItem(itemName)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName, true)
            .clickOnAddChildItem(itemName, itemName2)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName2, true)
            .clickOnAddChildItem(itemName2, itemName3)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName3, true)
            .clickOnSaveItem()
            .verifySuccessMessageExists()
            .clickReload()
            .verifyDataTableHasItem(itemName, true)
            .verifyDataTableHasItem(itemName2, true)
            .verifyDataTableHasItem(itemName3, true)

            .expandRow(itemName)
            .clickOnDeleteChildItem(itemName3)
            .verifySaveEnable(true)
            .clickOnSaveItem()
            .verifySuccessMessageExists()
            .verifyDataTableHasItem(itemName, true)
            .verifyDataTableHasItem(itemName2, true)
            .verifyDataTableHasItem(itemName3, false)
            .verifyDataTableHasItem('Item-1', true)
            .verifyDataTableHasItem('Item-2', true)
            .verifyDataTableHasItem('Item-3', true)
            .verifyDataTableHasItem('Item-4', true)
            .verifyDataTableHasItem('Item-5', true)
            .verifyDataTableHasItem('Item-6', true)


            .clickOnDeleteChildItem(itemName)
            .verifySaveEnable(true)
            .clickOnSaveItem()
            .verifySuccessMessageExists()
            .verifyDataTableHasItem(itemName, false)
            .verifyDataTableHasItem(itemName2, false)
            .verifyDataTableHasItem(itemName3, false)
            .verifyDataTableHasItem('Item-1', true)
            .verifyDataTableHasItem('Item-2', true)
            .verifyDataTableHasItem('Item-3', true)
            .verifyDataTableHasItem('Item-4', true)
            .verifyDataTableHasItem('Item-5', true)
            .verifyDataTableHasItem('Item-6', true)
        ;
    });

    it('should be able to add and delete item (without save)', () => {

        const itemName = `Item-${Math.random()}`;

        viewDataTablePage
            .clickReload()
            .verifySaveEnable(false)
            .clickOnAddItem(itemName)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName, true)
            .clickOnDeleteItem([itemName])
            .verifyDataTableHasItem(itemName, false)
        ;
    });

    it('should be able to add and delete item (with save)', () => {

        const itemName = `Item-${Math.random()}`;

        viewDataTablePage
            .clickOnAddItem(itemName)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName, true)
            .clickOnSaveItem()
            .clickReload()
            .verifySuccessMessageExists()

            .verifyDataTableHasItem(itemName, true)
            .clickOnDeleteItem([itemName])
            .clickOnSaveItem()
            .verifyDataTableHasItem(itemName, false)
            .clickReload()
            .verifySuccessMessageExists()
            .verifyDataTableHasItem(itemName, false)
        ;
    });
});
