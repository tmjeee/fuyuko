import {ViewDataTablePage} from "../page-object/sub-page-object/view-data-table.page";
import {LoginPage} from "../page-object/login.page";

describe('view-data-tabular-number spec', () => {
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


    it(`[number attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        Cypress.currentTest.retries(1);
        // text attribute
        {
            const attributeName = `number attribute`;
            const attributeValue = ((Math.random() + 1).toFixed(2));
            const v = `${attributeValue}`;

            viewDataTablePage
                .clickReload()
                // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editNumberValue(Number(attributeValue))
                .clickDone()

                // save
                .verifySaveEnable(true)
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellValue(itemName, attributeName, v)
                .clickOnSaveItem()
                .verifySuccessMessageExists()
                .verifySaveEnable(false)
                .verifyDataTableHasItem(itemName, true)

                // delete created item
                .clickOnDeleteItem([itemName])
                .verifySaveEnable(true)
                .clickOnSaveItem()
                .verifySuccessMessageExists()
                .verifyDataTableHasItem(itemName, false)
            ;
        }
    });

    it ('[number attribute] edit and cancel should not be saveable', () => {
        const itemName = `Item-1`;

        Cypress.currentTest.retries(1);
        // number attribute
        {
            const attributeName = `number attribute`;
            const attributeValue = ((Math.random() + 1).toFixed(2));
            const v = `${attributeValue}`;
            viewDataTablePage
                .clickReload()
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editNumberValue(Number(attributeValue))
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });

});
