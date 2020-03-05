import {LoginPage} from "./page-object/login.page";
import {ViewDataTablePage} from "./page-object/sub-page-object/view-data-table.page";

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

    it(`should do column filtering`, () => {
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
        });
    });

    it(`should add and delete hierachical item (without saving)`, () => {
        const itemName = `ParentItem-${Math.random()}`;
        const itemName2 = `ChildItem-${Math.random()}`;
        const itemName3 = `ChildChildItem-${Math.random()}`;

        viewDataTablePage
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

            .clickOnDeleteChildItem(itemName)
            .verifyDataTableHasItem(itemName, false)
            .verifyDataTableHasItem(itemName2, false)
            .verifyDataTableHasItem(itemName3, false)
        ;
    });


    it(`should add and delete hierachical item (with saving)`, () => {
        const itemName = `ParentItem-${Math.random()}`;
        const itemName2 = `ChildItem-${Math.random()}`;
        const itemName3 = `ChildChildItem-${Math.random()}`;

        viewDataTablePage
            .verifySaveEnable(false)
            .clickOnAddItem(itemName)
            .verifySaveEnable(true)
            .verifyDataTableHasItem(itemName, true)
            .clickOnAddChildItem(itemName, itemName2)
            .verifySaveEnable(true)
            .clickOnSaveItem()
            .verifySuccessMessageExists()
            .verifyDataTableHasItem(itemName2, true)
             .clickOnAddChildItem(itemName2, itemName3)
             .verifySaveEnable(true)
             .clickOnSaveItem()
             .verifySuccessMessageExists()
             .verifyDataTableHasItem(itemName3, true)

             .clickOnDeleteChildItem(itemName3)
             .verifySaveEnable(true)
             .clickOnSaveItem()
             .verifySuccessMessageExists()
             .verifyDataTableHasItem(itemName, true)
             .verifyDataTableHasItem(itemName2, true)
             .verifyDataTableHasItem(itemName3, false)

             .clickOnDeleteChildItem(itemName)
             .verifySaveEnable(true)
             .clickOnSaveItem()
             .verifySuccessMessageExists()
             .verifyDataTableHasItem(itemName, false)
             .verifyDataTableHasItem(itemName2, false)
             .verifyDataTableHasItem(itemName3, false)
        ;
    });

    it ('should be able to add and delete item (without save)', () => {

        const itemName = `Item-${Math.random()}`;

        viewDataTablePage
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
            .verifySaveEnable(false)
            .clickOnAddItem(itemName)
            .verifySaveEnable(true)
            .clickOnSaveItem()
            .verifySuccessMessageExists()

            .verifyDataTableHasItem(itemName, true)
            .clickOnDeleteItem([itemName])
            .clickOnSaveItem()
            .verifySuccessMessageExists()
            .verifyDataTableHasItem(itemName, false)
        ;
    });

    it(`[string attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // string attribute
        {
            const attributeName = `string attribute`;
            const attributeValue = `string value-${Math.random()}`;
            const v = attributeValue;

            viewDataTablePage
                // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editStringValue(attributeValue)
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

    it(`[string attribute] edit and cancel should not be saveable`, () => {

        const itemName = `Item-1`

        // string attribute
        {
            const attributeName = `string attribute`;
            const attributeValue = `string value-${Math.random()}`;
            const v = attributeValue;

            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editStringValue(attributeValue)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });


    it(`[text attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // text attribute
        {
            const attributeName = `text attribute`;
            const attributeValue = `text value-${Math.random()}`;
            const v = attributeValue;

            viewDataTablePage
                // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editTextValue(attributeValue)
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

    it ('[text attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`

        // text attribute
        {
            const attributeName = `text attribute`;
            const attributeValue = `text value-${Math.random()}`;
            const v = `${attributeValue}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editTextValue(attributeValue)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });


    it(`[number attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // text attribute
        {
            const attributeName = `number attribute`;
            const attributeValue = ((Math.random() + 1).toFixed(1));
            const v = `${attributeValue}`;

            viewDataTablePage
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

        // number attribute
        {
            const attributeName = `number attribute`;
            const attributeValue = ((Math.random() + 1).toFixed(1));
            const v = `${attributeValue}`;
            viewDataTablePage
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



    it(`[date attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // text attribute
        {
            const attributeName = `date attribute`;
            const attributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;
            const v = `${attributeValue}`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editDateValue(attributeValue)
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



    it ('[date attribute] edit and cancel should not be saveable', () => {
        const itemName = `Item-1`;

        // date attribute
        {
            const attributeName = `date attribute`;
            const attributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;
            const v = `${attributeValue}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editDateValue(attributeValue)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });




    it(`[currency attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // text attribute
        {
            const attributeName = `currency attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(2));
            const attributeUnit = 'AUD'
            const v = `$${attributeValue} ${attributeUnit}`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editCurrencyValue(Number(attributeValue), attributeUnit)
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


    it ('[currency attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`;

        // currency attribute
        {
            const attributeName = `currency attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(2));
            const attributeUnit = 'AUD'
            const v = `$${attributeValue} ${attributeUnit}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editCurrencyValue(Number(attributeValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }

    });





    it(`[volume attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // volume attribute
        {
            const attributeName = `volume attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'ml';
            const v = `${attributeValue} ${attributeUnit}`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editVolumeValue(Number(attributeValue), attributeUnit)
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






    it ('[volume attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`;

        // volume attribute
        {
            const attributeName = `volume attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'ml';
            const v = `${attributeValue} ${attributeUnit}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editVolumeValue(Number(attributeValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });



    it(`[dimension attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // dimension attribute
        {
            const attributeName = `dimension attribute`;
            const attributeLengthValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeWidthValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeHeightValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = [
                `w:${attributeWidthValue} ${attributeUnit}`,
                `h:${attributeHeightValue} ${attributeUnit}`,
                `l:${attributeLengthValue} ${attributeUnit}`
            ];

            viewDataTablePage
                // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editDimensionValue(Number(attributeLengthValue), Number(attributeWidthValue), Number(attributeHeightValue), attributeUnit)
                .clickDone()

                // save
                .verifySaveEnable(true)
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellValue(itemName, attributeName, ...v)
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






    it ('[dimension attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`;

        // dimension attribute
        {
            const attributeName = `dimension attribute`;
            const attributeLengthValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeWidthValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeHeightValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = [
                `w:${attributeWidthValue} ${attributeUnit}`,
                `h:${attributeHeightValue} ${attributeUnit}`,
                `l:${attributeLengthValue} ${attributeUnit}`
            ];
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editDimensionValue(Number(attributeLengthValue), Number(attributeWidthValue), Number(attributeHeightValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, ...v)
                .verifySaveEnable(false)
            ;
        }
    });




    it(`[area attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // area attribute
        {
            const attributeName = `area attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'm2';
            const v = `${attributeValue} ${attributeUnit}`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editAreaValue(Number(attributeValue), attributeUnit)
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




    it ('[area attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`;

        // area attribute
        {
            const attributeName = `area attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'm2';
            const v = `${attributeValue} ${attributeUnit}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editAreaValue(Number(attributeValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });




    it(`[length attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // length attribute
        {
            const attributeName = `length attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = `${attributeValue} ${attributeUnit}`;

            viewDataTablePage
                // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editLengthValue(Number(attributeValue), attributeUnit)
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


    it ('[length attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`;

        // length attribute
        {
            const attributeName = `length attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = `${attributeValue} ${attributeUnit}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editLengthValue(Number(attributeValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });




    it(`[width attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // width attribute
        {
            const attributeName = `width attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = `${attributeValue} ${attributeUnit}`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editWidthValue(Number(attributeValue), attributeUnit)
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




    it ('[width attribute] edit and cancel should not be saveable', () => {
        const itemName = `Item-1`;
        // width attribute
        {
            const attributeName = `width attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = `${attributeValue} ${attributeUnit}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editWidthValue(Number(attributeValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });




    it(`[height attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // height attribute
        {
            const attributeName = `height attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = `${attributeValue} ${attributeUnit}`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editHeightValue(Number(attributeValue), attributeUnit)
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



    it ('[height attribute] edit and cancel should not be saveable', () => {

        const itemName = `Item-1`;

        // height attribute
        {
            const attributeName = `height attribute`;
            const attributeValue = ((Math.random() * 10 + 1).toFixed(1));
            const attributeUnit = 'cm';
            const v = `${attributeValue} ${attributeUnit}`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editHeightValue(Number(attributeValue), attributeUnit)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }

    });




    it(`[select attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // select attribute
        {
            const attributeName = `select attribute`;
            const attributeValue = `key3`
            const v = `value3`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editSelectValue(attributeValue)
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





    it ('[select attribute] edit and cancel should not be saveable', () => {
        const itemName = `Item-1`;

        // select attribute
        {
            const attributeName = `select attribute`;
            const attributeValue = `key3`
            const v = `value3`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editSelectValue(attributeValue)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });




    it(`[doubleselect attribute] add item, edit attribute and delete item`, () => {
        const itemName = `Add-item-${Math.random()}`;

        // doubleselect attribute
        {
            const attributeName = `doubleselect attribute`;
            const attributeValue1 = `key2`
            const attributeValue2 = `xkey22`
            const v = `value2 - xvalue22`;

            viewDataTablePage
            // create new item
                .verifySaveEnable(false)
                .clickOnAddItem(itemName)
                .verifyDataTableHasItem(itemName, true)
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editDoubleSelectValue(attributeValue1, attributeValue2)
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




    it('[doubleselect attribute] edit and cancel should not be saveable', () => {
        const itemName = `Item-1`;

        // doubleselect attribute
        {
            const attributeName = `doubleselect attribute`;
            const attributeValue1 = `key2`
            const attributeValue2 = `xkey22`
            const v = `value2 - xvalue22`;
            viewDataTablePage
                .clickOnItemAttributeCellToEdit(itemName, attributeName)
                .verifyPopupTitle()
                .editDoubleSelectValue(attributeValue1, attributeValue2)
                .clickCancel()
                .verifyAttributeCellExists(attributeName, true)
                .verifyAttributeCellNotValue(itemName, attributeName, v)
                .verifySaveEnable(false)
            ;
        }
    });
});
