import {LoginPage} from "../page-object/login.page";
import {ViewDataListPage} from "../page-object/sub-page-object/view-data-list.page";


describe(`view-data-list spec`, () => {

    let viewDataListPage: ViewDataListPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // viewDataListPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitViewPage()
        //     .visitViewDataList();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataListPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewDataList()
            .selectGlobalView(`Test View 1`);
        // viewDataListPage.visit();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataListPage
            .validateTitle()
        ;
    });

    it('should expand and collapse panel', () => {
        const itemName  = `Item-2`;
        viewDataListPage
            .clickOnPanel(itemName)
            .verifyPanelExpanded(itemName)
            .clickOnPanel(itemName)
            .verifyPanelCollapsed(itemName)
        ;
    });


    it.skip('should be searchable (basic search)', () => {
        viewDataListPage
            .doBasicSearch(`Item-2`)
            .verifyListResultSize(1)
            .verifyListHasItem(`Item-2`, true)
            .doBasicSearch('asdsdsdsdsdsdsdsds')
            .verifyListResultSize(0)
            .verifyListHasItem('asdsdsdsdsdsdsdsds', false)
            .doBasicSearch('')
    });

    ///////////////////////////////////////

    it('should not create item', () => {
        const itemName = `New-Item-${Math.random()}`;
        const itemDescription = `New-Item-Description-${Math.random()}`;

        const string_attributeName = `string attribute`;
        const string_attributeValue = `string-value-${Math.random()}`;
        const string_v = string_attributeValue;

        const text_attributeName = `text attribute`;
        const text_attributeValue = `text value-${Math.random()}`;
        const text_v = `${text_attributeValue}`;

        const number_attributeName = `number attribute`;
        const number_attributeValue = ((Math.random() + 1).toFixed(1));
        const number_v = `${number_attributeValue}`;

        const date_attributeName = `date attribute`;
        const date_attributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;
        const date_v = `${date_attributeValue}`;

        const currency_attributeName = `currency attribute`;
        const currency_attributeValue = ((Math.random() * 10 + 1).toFixed(2));
        const currency_attributeUnit = 'AUD'
        const currency_v = `$${currency_attributeValue} ${currency_attributeUnit}`;

        const volume_attributeName = `volume attribute`;
        const volume_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const volume_attributeUnit = 'ml';
        const volume_v = `${volume_attributeValue} ${volume_attributeUnit}`;

        const dimension_attributeName = `dimension attribute`;
        const dimension_attributeLengthValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeWidthValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeHeightValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeUnit = 'cm';
        const dimension_v = [
            `w:${dimension_attributeWidthValue} ${dimension_attributeUnit}`,
            `h:${dimension_attributeHeightValue} ${dimension_attributeUnit}`,
            `l:${dimension_attributeLengthValue} ${dimension_attributeUnit}`
        ];


        const area_attributeName = `area attribute`;
        const area_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const area_attributeUnit = 'm2';
        const area_v = `${area_attributeValue} ${area_attributeUnit}`;

        const length_attributeName = `length attribute`;
        const length_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const length_attributeUnit = 'cm';
        const length_v = `${length_attributeValue} ${length_attributeUnit}`;

        const width_attributeName = `width attribute`;
        const width_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const width_attributeUnit = 'cm';
        const width_v = `${width_attributeValue} ${width_attributeUnit}`;

        const height_attributeName = `height attribute`;
        const height_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const height_attributeUnit = 'cm';
        const height_v = `${height_attributeValue} ${height_attributeUnit}`;

        const select_attributeName = `select attribute`;
        const select_attributeValue = `key3`
        const select_v = `value3`;

        const doubleselect_attributeName = `doubleselect attribute`;
        const doubleselect_attributeValue1 = `key2`
        const doubleselect_attributeValue2 = `xkey22`
        const doubleselect_v = `value2 - xvalue22`;

        viewDataListPage
            .clickAdd()
                // item name
            .editItemName(itemName)
            .clickOk2() // done with item name edit popup
                // item description
            .editItemDescription(itemDescription)
            .clickCancel2()
                // string
            .editStringAttribute(string_attributeName, string_attributeValue)
            .clickCancel2()
                // text
            .editTextAttribute(text_attributeName, text_attributeValue)
            .clickCancel2()
                // number
            .editNumericAttribute(number_attributeName, Number(number_attributeValue))
            .clickCancel2()
                // date
            .editDateAttribute(date_attributeName, date_attributeValue)
            .clickCancel2()
                // currency
            .editCurrencyAttribute(currency_attributeName, Number(currency_attributeValue), currency_attributeUnit)
            .clickCancel2()
                // volume
            .editVolumeAttribute(volume_attributeName, Number(volume_attributeValue), volume_attributeUnit)
            .clickCancel2()
                // dimension
            .editDimensionAttribute(dimension_attributeName, Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickCancel2()
                // area
            .editAreaAttribute(area_attributeName, Number(area_attributeValue), area_attributeUnit)
            .clickCancel2()
                // length
            .editLengthAttribute(length_attributeName, Number(length_attributeValue), length_attributeUnit)
            .clickCancel2()
                // width
            .editWidthAttribute(width_attributeName, Number(width_attributeValue), width_attributeUnit)
            .clickCancel2()
                // height
            .editHeightAttribute(height_attributeName, Number(height_attributeValue), height_attributeUnit)
            .clickCancel2()
                // select
            .editSelectAttribute(select_attributeName, select_attributeValue)
            .clickCancel2()
                // doubleselect
            .editDoubleSelectAttribute(doubleselect_attributeName, doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickCancel2()

            // done with view data list add item popup
            .clickOk()

            .clickOnPanel(itemName)
            .verifyInPanelItemName(itemName)
            .verifyInPanelItemNotDescription(itemName, itemDescription)
            .verifyInPanelAttributeNotValue(itemName, string_attributeName, [string_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, text_attributeName, [text_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, number_attributeName, [number_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, date_attributeName, [date_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, currency_attributeName, [currency_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, volume_attributeName, [volume_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue])
            .verifyInPanelAttributeNotValue(itemName, area_attributeName, [area_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, length_attributeName, [length_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, width_attributeName, [width_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, height_attributeName, [height_attributeValue])
            .verifyInPanelAttributeNotValue(itemName, select_attributeName, [select_v])
            .verifyInPanelAttributeNotValue(itemName, doubleselect_attributeName, [doubleselect_v])
    });


    it('should create item', () => {
        const itemName = `New-Item-${Math.random()}`;
        const itemDescription = `New-Item-Description-${Math.random()}`;

        const string_attributeName = `string attribute`;
        const string_attributeValue = `string-value-${Math.random()}`;
        const string_v = string_attributeValue;

        const text_attributeName = `text attribute`;
        const text_attributeValue = `text value-${Math.random()}`;
        const text_v = `${text_attributeValue}`;

        const number_attributeName = `number attribute`;
        const number_attributeValue = ((Math.random() + 1).toFixed(1));
        const number_v = `${number_attributeValue}`;

        const date_attributeName = `date attribute`;
        const date_attributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;
        const date_v = `${date_attributeValue}`;

        const currency_attributeName = `currency attribute`;
        const currency_attributeValue = ((Math.random() * 10 + 1).toFixed(2));
        const currency_attributeUnit = 'AUD'
        const currency_v = `$${currency_attributeValue} ${currency_attributeUnit}`;

        const volume_attributeName = `volume attribute`;
        const volume_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const volume_attributeUnit = 'ml';
        const volume_v = `${volume_attributeValue} ${volume_attributeUnit}`;

        const dimension_attributeName = `dimension attribute`;
        const dimension_attributeLengthValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeWidthValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeHeightValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeUnit = 'cm';
        const dimension_v = [
            `w:${dimension_attributeWidthValue} ${dimension_attributeUnit}`,
            `h:${dimension_attributeHeightValue} ${dimension_attributeUnit}`,
            `l:${dimension_attributeLengthValue} ${dimension_attributeUnit}`
        ];


        const area_attributeName = `area attribute`;
        const area_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const area_attributeUnit = 'm2';
        const area_v = `${area_attributeValue} ${area_attributeUnit}`;

        const length_attributeName = `length attribute`;
        const length_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const length_attributeUnit = 'cm';
        const length_v = `${length_attributeValue} ${length_attributeUnit}`;

        const width_attributeName = `width attribute`;
        const width_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const width_attributeUnit = 'cm';
        const width_v = `${width_attributeValue} ${width_attributeUnit}`;

        const height_attributeName = `height attribute`;
        const height_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const height_attributeUnit = 'cm';
        const height_v = `${height_attributeValue} ${height_attributeUnit}`;

        const select_attributeName = `select attribute`;
        const select_attributeValue = `key3`
        const select_v = `value3`;

        const doubleselect_attributeName = `doubleselect attribute`;
        const doubleselect_attributeValue1 = `key2`
        const doubleselect_attributeValue2 = `xkey22`
        const doubleselect_v = `value2 - xvalue22`;

        viewDataListPage
            .clickAdd()
            // item name
            .editItemName(itemName)
            .clickOk2() // done with item name edit popup
            // item description
            .editItemDescription(itemDescription)
            .clickOk2()
            // string
            .editStringAttribute(string_attributeName, string_attributeValue)
            .clickOk2()
            // text
            .editTextAttribute(text_attributeName, text_attributeValue)
            .clickOk2()
            // number
            .editNumericAttribute(number_attributeName, Number(number_attributeValue))
            .clickOk2()
            // date
            .editDateAttribute(date_attributeName, date_attributeValue)
            .clickOk2()
            // currency
            .editCurrencyAttribute(currency_attributeName, Number(currency_attributeValue), currency_attributeUnit)
            .clickOk2()
            // volume
            .editVolumeAttribute(volume_attributeName, Number(volume_attributeValue), volume_attributeUnit)
            .clickOk2()
            // dimension
            .editDimensionAttribute(dimension_attributeName, Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickOk2()
            // area
            .editAreaAttribute(area_attributeName, Number(area_attributeValue), area_attributeUnit)
            .clickOk2()
            // length
            .editLengthAttribute(length_attributeName, Number(length_attributeValue), length_attributeUnit)
            .clickOk2()
            // width
            .editWidthAttribute(width_attributeName, Number(width_attributeValue), width_attributeUnit)
            .clickOk2()
            // height
            .editHeightAttribute(height_attributeName, Number(height_attributeValue), height_attributeUnit)
            .clickOk2()
            // select
            .editSelectAttribute(select_attributeName, select_attributeValue)
            .clickOk2()
            // doubleselect
            .editDoubleSelectAttribute(doubleselect_attributeName, doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickOk2()

            // done with view data list add item popup
            .clickOk()

            .clickOnPanel(itemName)
            .verifyInPanelItemName(itemName)
            .verifyInPanelItemDescription(itemName, itemDescription)
            .verifyInPanelAttributeValue(itemName, string_attributeName, [string_attributeValue])
            .verifyInPanelAttributeValue(itemName, text_attributeName, [text_attributeValue])
            .verifyInPanelAttributeValue(itemName, number_attributeName, [number_attributeValue])
            .verifyInPanelAttributeValue(itemName, date_attributeName, [date_attributeValue])
            .verifyInPanelAttributeValue(itemName, currency_attributeName, [currency_attributeValue])
            .verifyInPanelAttributeValue(itemName, volume_attributeName, [volume_attributeValue])
            .verifyInPanelAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue])
            .verifyInPanelAttributeValue(itemName, area_attributeName, [area_attributeValue])
            .verifyInPanelAttributeValue(itemName, length_attributeName, [length_attributeValue])
            .verifyInPanelAttributeValue(itemName, width_attributeName, [width_attributeValue])
            .verifyInPanelAttributeValue(itemName, height_attributeName, [height_attributeValue])
            .verifyInPanelAttributeValue(itemName, select_attributeName, [select_v])
            .verifyInPanelAttributeValue(itemName, doubleselect_attributeName, [doubleselect_v])


            .clickDelete([itemName])
            .clickSave()
    });


    it('should edit item', () => {

        const itemName = `New-Item-${Math.random()}`;
        const newItemName=`New-New-Item-${Math.random()}`;
        const itemDescription = `New-Item-Description-${Math.random()}`;

        const string_attributeName = `string attribute`;
        const string_attributeValue = `string-value-${Math.random()}`;
        const string_v = string_attributeValue;

        const text_attributeName = `text attribute`;
        const text_attributeValue = `text value-${Math.random()}`;
        const text_v = `${text_attributeValue}`;

        const number_attributeName = `number attribute`;
        const number_attributeValue = ((Math.random() + 1).toFixed(1));
        const number_v = `${number_attributeValue}`;

        const date_attributeName = `date attribute`;
        const date_attributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;
        const date_v = `${date_attributeValue}`;

        const currency_attributeName = `currency attribute`;
        const currency_attributeValue = ((Math.random() * 10 + 1).toFixed(2));
        const currency_attributeUnit = 'AUD'
        const currency_v = `$${currency_attributeValue} ${currency_attributeUnit}`;

        const volume_attributeName = `volume attribute`;
        const volume_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const volume_attributeUnit = 'ml';
        const volume_v = `${volume_attributeValue} ${volume_attributeUnit}`;

        const dimension_attributeName = `dimension attribute`;
        const dimension_attributeLengthValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeWidthValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeHeightValue = ((Math.random() * 10 + 1).toFixed(1));
        const dimension_attributeUnit = 'cm';
        const dimension_v = [
            `w:${dimension_attributeWidthValue} ${dimension_attributeUnit}`,
            `h:${dimension_attributeHeightValue} ${dimension_attributeUnit}`,
            `l:${dimension_attributeLengthValue} ${dimension_attributeUnit}`
        ];


        const area_attributeName = `area attribute`;
        const area_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const area_attributeUnit = 'm2';
        const area_v = `${area_attributeValue} ${area_attributeUnit}`;

        const length_attributeName = `length attribute`;
        const length_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const length_attributeUnit = 'cm';
        const length_v = `${length_attributeValue} ${length_attributeUnit}`;

        const width_attributeName = `width attribute`;
        const width_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const width_attributeUnit = 'cm';
        const width_v = `${width_attributeValue} ${width_attributeUnit}`;

        const height_attributeName = `height attribute`;
        const height_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
        const height_attributeUnit = 'cm';
        const height_v = `${height_attributeValue} ${height_attributeUnit}`;

        const select_attributeName = `select attribute`;
        const select_attributeValue = `key3`
        const select_v = `value3`;

        const doubleselect_attributeName = `doubleselect attribute`;
        const doubleselect_attributeValue1 = `key2`
        const doubleselect_attributeValue2 = `xkey22`
        const doubleselect_v = `value2 - xvalue22`;

        // create new item
        viewDataListPage
            .clickAdd()
            .editItemName(itemName)
            .clickOk2()
            .clickOk()
            .clickSave()
            .verifySuccessMessageExists()
        ;

        // edit item
        viewDataListPage
            .clickOnPanel(itemName)

            // item name
            .clickOnItemName(itemName)
            .editItemName(newItemName)
            .clickOk()

            // item description
            .clickOnItemDescription(newItemName)
            .editItemDescription(itemDescription)
            .clickOk()

            // string
            .clickOnAttribute(newItemName, string_attributeName)
            .editStringAttribute(string_attributeValue)
            .clickOk()

            // text
            .clickOnAttribute(newItemName, text_attributeName)
            .editTextAttribute(text_attributeValue)
            .clickOk()

            // number
            .clickOnAttribute(newItemName, number_attributeName)
            .editNumericAttribute(Number(number_attributeValue))
            .clickOk()

            // date
            .clickOnAttribute(newItemName, date_attributeName)
            .editDateAttribute(date_attributeValue)
            .clickOk()

            // currency
            .clickOnAttribute(newItemName, currency_attributeName)
            .editCurrencyAttribute(Number(currency_attributeValue), currency_attributeUnit)
            .clickOk()

            // volume
            .clickOnAttribute(newItemName, volume_attributeName)
            .editVolumeAttribute(Number(volume_attributeValue), volume_attributeUnit)
            .clickOk()

            // dimension
            .clickOnAttribute(newItemName, dimension_attributeName)
            .editDimensionAttribute(Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickOk()

            // area
            .clickOnAttribute(newItemName, area_attributeName)
            .editAreaAttribute(Number(area_attributeValue), area_attributeUnit)
            .clickOk()

            // length
            .clickOnAttribute(newItemName, length_attributeName)
            .editLengthAttribute(Number(length_attributeValue), length_attributeUnit)
            .clickOk()

            // width
            .clickOnAttribute(newItemName, width_attributeName)
            .editWidthAttribute(Number(width_attributeValue), width_attributeUnit)
            .clickOk()

            // height
            .clickOnAttribute(newItemName, height_attributeName)
            .editHeightAttribute(Number(height_attributeValue), height_attributeUnit)
            .clickOk()

            // select
            .clickOnAttribute(newItemName, select_attributeName)
            .editSelectAttribute(select_attributeValue)
            .clickOk()

            // doubleselect
            .clickOnAttribute(newItemName, doubleselect_attributeName)
            .editDoubleSelectAttribute(doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickOk()

            .clickSave()
            .verifySuccessMessageExists()

            .verifyInPanelItemName(newItemName)
            .verifyInPanelItemDescription(newItemName, itemDescription)
            .verifyInPanelAttributeValue(newItemName, string_attributeName, [string_attributeValue])
            .verifyInPanelAttributeValue(newItemName, text_attributeName, [text_attributeValue])
            .verifyInPanelAttributeValue(newItemName, number_attributeName, [number_attributeValue])
            .verifyInPanelAttributeValue(newItemName, date_attributeName, [date_attributeValue])
            .verifyInPanelAttributeValue(newItemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, area_attributeName, [area_attributeValue, area_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, length_attributeName, [length_attributeValue, length_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, width_attributeName, [width_attributeValue, width_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, height_attributeName, [height_attributeValue, height_attributeUnit])
            .verifyInPanelAttributeValue(newItemName, select_attributeName, [select_v])
            .verifyInPanelAttributeValue(newItemName, doubleselect_attributeName, [doubleselect_v])


            .clickDelete([newItemName])
            .clickSave()
        ;
    });
});
