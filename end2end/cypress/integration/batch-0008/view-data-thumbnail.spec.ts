import {LoginPage} from "../page-object/login.page";
import {ViewDataThumbnailPage} from "../page-object/sub-page-object/view-data-thumbnail.page";
import {AreaUnits} from "../model/unit.model";


describe('view-data-thumbnail spec', () => {

    let viewDataThumbnailPage: ViewDataThumbnailPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // viewDataThumbnailPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitViewPage()
        //     .visitViewDataThumbnail();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataThumbnailPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewDataThumbnail()
            .selectGlobalView(`Test View 1`);
        // viewDataThumbnailPage.visit();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataThumbnailPage
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
            .clickSave()
            .verifySuccessMessageExists()
            .clickDeleteThumbnail([itemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });


    it (`should show more / show less when clicked`, () => {
        const itemName = `Item-2`;
        viewDataThumbnailPage
            .clickItemShowMore(itemName)
            .verifyIsShowMore(itemName)
            .clickItemShowLess(itemName)
            .verifyIsShowLess(itemName)
    });



    it('should change name / description of thumbnail', ()=> {
        const itemName = `Test-Item-${Math.random()}`;
        const newItemName = `New-Test-Item-${Math.random()}`;
        const description = `New-Test-Item-Description-${Math.random()}`;
        viewDataThumbnailPage
            // verify name
            .clickAddThumbnail(itemName)
            .clickThumbnailItemName(itemName)
            .verifyPopupTitle()
            .editItemName(newItemName)
            .clickOk()
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailsHasItem(itemName, false)
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailsHasItem(itemName, false)

            // verify description
            .clickThumbnailItemDescription(newItemName)
            .verifyPopupTitle()
            .editItemDescription(description)
            .clickOk()
            .verifyThumbnailItemHasDescription(newItemName, description)
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailItemHasDescription(newItemName, description)

            // delete item
            .clickDeleteThumbnail([newItemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });

    /////////////// set 1
    it.only(`[string attribute] should change attributes of thumbnail`, () => {

        const itemName = `Test-Item-${Math.random()}`;

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


        viewDataThumbnailPage
            .clickAddThumbnail(itemName)

            // string
            .clickThumbnailItemAttribute(itemName, string_attributeName)
            .verifyPopupTitle()
            .editStringAttribute(string_attributeValue)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, string_attributeName, [string_attributeValue])

            // text
            .clickThumbnailItemAttribute(itemName, text_attributeName)
            .verifyPopupTitle()
            .editTextAttribute(text_attributeValue)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // number
            .clickThumbnailItemAttribute(itemName, number_attributeName)
            .verifyPopupTitle()
            .editNumericAttribute(Number(number_attributeValue))
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, number_attributeName, [number_attributeValue])

            // date
            .clickThumbnailItemAttribute(itemName, date_attributeName)
            .verifyPopupTitle()
            .editDateAttribute(date_attributeValue)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, date_attributeName, [date_attributeValue])

            // currency
            .clickThumbnailItemAttribute(itemName, currency_attributeName)
            .verifyPopupTitle()
            .editCurrencyAttribute(Number(currency_attributeValue), currency_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, currency_attributeName, [currency_attributeValue])

            // volume
            .clickThumbnailItemAttribute(itemName, volume_attributeName)
            .verifyPopupTitle()
            .editVolumeAttribute(Number(volume_attributeValue), volume_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, volume_attributeName, [volume_attributeValue])

            // dimension
            .clickThumbnailItemAttribute(itemName, dimension_attributeName)
            .verifyPopupTitle()
            .editDimensionAttribute(Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .clickThumbnailItemAttribute(itemName, area_attributeName)
            .verifyPopupTitle()
            .editAreaAttribute(Number(area_attributeValue), area_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, area_attributeName, [area_attributeValue])

            // length
            .clickThumbnailItemAttribute(itemName, length_attributeName)
            .verifyPopupTitle()
            .editLengthAttribute(Number(length_attributeValue), length_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, length_attributeName, [length_attributeValue])

            // width
            .clickThumbnailItemAttribute(itemName, width_attributeName)
            .verifyPopupTitle()
            .editWidthAttribute(Number(width_attributeValue), width_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, width_attributeName, [width_attributeValue])

            // height
            .clickThumbnailItemAttribute(itemName, height_attributeName)
            .verifyPopupTitle()
            .editHeightAttribute(Number(height_attributeValue), height_attributeUnit)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, height_attributeName, [height_attributeValue])

            // select
            .clickThumbnailItemAttribute(itemName, select_attributeName)
            .verifyPopupTitle()
            .editSelectAttribute(select_attributeValue)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, select_attributeName, [select_v])

            // doubleselect
            .clickThumbnailItemAttribute(itemName, doubleselect_attributeName)
            .verifyPopupTitle()
            .editDoubleSelectAttribute(doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickCancel(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, text_attributeName, [doubleselect_v])



            // string
            .clickThumbnailItemAttribute(itemName, string_attributeName)
            .editStringAttribute(string_attributeValue)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, string_attributeName, [string_attributeValue])

            // text
            .clickThumbnailItemAttribute(itemName, text_attributeName)
            .editTextAttribute(text_attributeValue)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // number
            .clickThumbnailItemAttribute(itemName, number_attributeName)
            .editNumericAttribute(Number(number_attributeValue))
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, number_attributeName, [number_attributeValue])

            // date
            .clickThumbnailItemAttribute(itemName, date_attributeName)
            .editDateAttribute(date_attributeValue)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, date_attributeName, [date_attributeValue])

            // currency
            .clickThumbnailItemAttribute(itemName, currency_attributeName)
            .editCurrencyAttribute(Number(currency_attributeValue), currency_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])

            // volume
            .clickThumbnailItemAttribute(itemName, volume_attributeName)
            .editVolumeAttribute(Number(volume_attributeValue), volume_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .verifyThumbnailItemHasAttributeValue(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .clickThumbnailItemAttribute(itemName, dimension_attributeName)
            .editDimensionAttribute(Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .clickThumbnailItemAttribute(itemName, area_attributeName)
            .editAreaAttribute(Number(area_attributeValue), area_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // length
            .clickThumbnailItemAttribute(itemName, length_attributeName)
            .editLengthAttribute(Number(length_attributeValue), length_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .clickThumbnailItemAttribute(itemName, width_attributeName)
            .editWidthAttribute(Number(width_attributeValue), width_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .clickThumbnailItemAttribute(itemName, height_attributeName)
            .editHeightAttribute(Number(height_attributeValue), height_attributeUnit)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .clickThumbnailItemAttribute(itemName, select_attributeName)
            .editSelectAttribute(select_attributeValue)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, select_attributeName, [select_v])

            // doubleselect
            .clickThumbnailItemAttribute(itemName, doubleselect_attributeName)
            .editDoubleSelectAttribute(doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickOk(viewDataThumbnailPage)
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, doubleselect_attributeName, [doubleselect_v])



            // save
            .clickSave()
            .verifySuccessMessageExists()
            .clickItemShowMore(itemName)

            // string
            .verifyThumbnailItemHasAttributeValue(itemName, string_attributeName, [string_attributeValue])

            // text
            .verifyThumbnailItemHasAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // number
            .verifyThumbnailItemHasAttributeValue(itemName, number_attributeName, [number_attributeValue])

            // date
            .verifyThumbnailItemHasAttributeValue(itemName, date_attributeName, [date_attributeValue])

            // currency
            .verifyThumbnailItemHasAttributeValue(itemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])

            // volume
            .verifyThumbnailItemHasAttributeValue(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .verifyThumbnailItemHasAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .verifyThumbnailItemHasAttributeValue(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // length
            .verifyThumbnailItemHasAttributeValue(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .verifyThumbnailItemHasAttributeValue(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .verifyThumbnailItemHasAttributeValue(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .verifyThumbnailItemHasAttributeValue(itemName, select_attributeName, [select_v])

            // doubleselect
            .verifyThumbnailItemHasAttributeValue(itemName, doubleselect_attributeName, [doubleselect_v])




            // delete item
            .clickDeleteThumbnail([itemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });


    //////////// set 2
    it(`[string attribute] should allow editing of attributes through edit icon`, () => {

        const itemName = `Test-Item-${Math.random()}`;

        const string_attributeName = `string attribute`;
        const string_attributeValue = `string-value-${Math.random()}`;
        const string_v = string_attributeValue;

        const text_attributeName = `text attribute`;
        const text_attributeValue = `text value-${Math.random()}`;
        const text_v = `${text_attributeValue}`;

        const number_attributeName = `number attribute`;
        const number_attributeValue = ((Math.random() * 10 + 1).toFixed(1));
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
        const area_attributeUnit: AreaUnits = 'mm2';
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

        viewDataThumbnailPage
            .clickAddThumbnail(itemName)

            // string
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editStringAttribute(string_attributeName, string_attributeValue)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, string_attributeName, [string_attributeValue])


            // text
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editTextAttribute(text_attributeName, text_attributeValue)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // number
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editNumericAttribute(number_attributeName, Number(number_attributeValue))
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // date
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editDateAttribute(date_attributeName, date_attributeValue)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, date_attributeName, [date_attributeValue])


            // currency
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editCurrencyAttribute(currency_attributeName, Number(currency_attributeValue), currency_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])

            // volume
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editVolumeAttribute(volume_attributeName, Number(volume_attributeValue), volume_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editDimensionAttribute(dimension_attributeName, Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue])

            // area
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editAreaAttribute(area_attributeName, Number(area_attributeValue), area_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // length
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editLengthAttribute(length_attributeName, Number(length_attributeValue), length_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editWidthAttribute(width_attributeName, Number(width_attributeValue), width_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editHeightAttribute(height_attributeName, Number(height_attributeValue), height_attributeUnit)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editSelectAttribute(select_attributeName, select_attributeValue)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, select_attributeName, [select_v])

            // doubleselect
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editDoubleSelectAttribute(doubleselect_attributeName, doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickOk1()
            .clickCancel()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasNoAttributeValue(itemName, doubleselect_attributeName, [doubleselect_v])




            // string
            .clickEditThumbnailIcon(itemName)
            .editStringAttribute(string_attributeName, string_attributeValue)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, string_attributeName, [string_attributeValue])


            // text
            .clickEditThumbnailIcon(itemName)
            .editTextAttribute(text_attributeName, text_attributeValue)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // number
            .clickEditThumbnailIcon(itemName)
            .editNumericAttribute(number_attributeName, Number(number_attributeValue))
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, number_attributeName, [number_attributeValue])

            // date
            .clickEditThumbnailIcon(itemName)
            .editDateAttribute(date_attributeName, date_attributeValue)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, date_attributeName, [date_attributeValue])

            // currency
            .clickEditThumbnailIcon(itemName)
            .editCurrencyAttribute(currency_attributeName, Number(currency_attributeValue), currency_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, currency_attributeName, [currency_attributeValue])

            // volume
            .clickEditThumbnailIcon(itemName)
            .editVolumeAttribute(volume_attributeName, Number(volume_attributeValue), volume_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .clickEditThumbnailIcon(itemName)
            .editDimensionAttribute(dimension_attributeName, Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .clickEditThumbnailIcon(itemName)
            .editAreaAttribute(area_attributeName, Number(area_attributeValue), area_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // length
            .clickEditThumbnailIcon(itemName)
            .editLengthAttribute(length_attributeName, Number(length_attributeValue), length_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .clickEditThumbnailIcon(itemName)
            .editWidthAttribute(width_attributeName, Number(width_attributeValue), width_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .clickEditThumbnailIcon(itemName)
            .editHeightAttribute(height_attributeName, Number(height_attributeValue), height_attributeUnit)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .clickEditThumbnailIcon(itemName)
            .editSelectAttribute(select_attributeName, select_attributeValue)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, select_attributeName, [select_v])

            // doubleselect
            .clickEditThumbnailIcon(itemName)
            .editDoubleSelectAttribute(doubleselect_attributeName, doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickOk1()
            .clickOk()
            .clickItemShowMore(itemName)
            .verifyThumbnailItemHasAttributeValue(itemName, doubleselect_attributeName, [doubleselect_v])



            .clickSave()
            .verifySuccessMessageExists()
            .clickItemShowMore(itemName)

            // string
            .verifyThumbnailItemHasAttributeValue(itemName, string_attributeName, [string_attributeValue])

            // text
            .verifyThumbnailItemHasAttributeValue(itemName, text_attributeName, [text_attributeValue])

            // number
            .verifyThumbnailItemHasAttributeValue(itemName, number_attributeName, [number_attributeValue])

            // date
            .verifyThumbnailItemHasAttributeValue(itemName, date_attributeName, [date_attributeValue])

            // currency
            .verifyThumbnailItemHasAttributeValue(itemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])

            // volume
            .verifyThumbnailItemHasAttributeValue(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .verifyThumbnailItemHasAttributeValue(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .verifyThumbnailItemHasAttributeValue(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // length
            .verifyThumbnailItemHasAttributeValue(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .verifyThumbnailItemHasAttributeValue(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .verifyThumbnailItemHasAttributeValue(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .verifyThumbnailItemHasAttributeValue(itemName, select_attributeName, [select_v])

            // doubleselect
            .verifyThumbnailItemHasAttributeValue(itemName, doubleselect_attributeName, [doubleselect_v])



            // delete item
            .clickDeleteThumbnail([itemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)

        ;
    });


    it('should change item name and description through edit icon', () => {
        const m = Math.random();
        const itemName = `Test-Item-${m}`;
        const newItemName = `New-Test-Item-${m}`;
        const newItemDescription = `New-Test-Item-Description-${m}`;

        viewDataThumbnailPage
            .clickAddThumbnail(itemName)

            // edit and cancel
            .clickEditThumbnailIcon(itemName)
            .editItemName(newItemName)
            .clickOk2()
            .clickCancel()
            .verifyThumbnailsHasItem(itemName, true)
            .verifyThumbnailsHasItem(newItemName, false)
            .clickEditThumbnailIcon(itemName)
            .editItemDescription(newItemDescription)
            .clickOk2()
            .clickCancel()
            .verifyThumbnailItemHasNoDescription(itemName, newItemDescription)

            // edit and save
            .clickEditThumbnailIcon(itemName)
            .editItemName(newItemName)
            .clickOk2()
            .clickOk()
            .clickEditThumbnailIcon(newItemName)
            .editItemDescription(newItemDescription)
            .clickOk2()
            .clickOk()
            .verifyThumbnailsHasItem(itemName, false)
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailItemHasDescription(newItemName, newItemDescription)
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailItemHasDescription(newItemName, newItemDescription)

            // delete (clean up)
            .clickDeleteThumbnail([newItemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(newItemName, false)
        ;
    });
});
