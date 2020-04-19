import {ViewValidationPage} from "./page-object/sub-page-object/view-validation.page";
import {LoginPage} from "./page-object/login.page";
import {ViewValidationDetailsPage} from "./page-object/sub-page-object/view-validation-details.page";


describe(`view validation details spec`, () => {

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


    const validationName = `test-validation-${Math.random()}`;
    const validationDescription = `test-validation-description-${Math.random()}`;

    let viewValidationPage: ViewValidationPage;
    let viewValidationDetailsPage: ViewValidationDetailsPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewValidationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitValidations()
            .validateTitle()
            .clickRunValidation()
            .verifyPopupTitle()
            .editName(validationName)
            .editDescription(validationDescription)
            .clickOk()
            .verifySuccessMessageExists()
        ;

        cy.wait(1000); // wait for validation to be done

        viewValidationDetailsPage =
            viewValidationPage
                .clickReload()
                .clickOnValidationDetails(validationName)
        ;
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewValidationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitValidations()
            .validateTitle()
        ;
        // viewValidationDetailsPage =
        //     viewValidationPage
        //         .clickReload()
        //         .clickOnValidationDetails(validationName)
        // viewValidationDetailsPage
        //    .visit();
        cy.wait(1000);
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        viewValidationDetailsPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it(`should switch tabs`, () => {
        viewValidationDetailsPage
            .clickTab('logs')
            .verifyTab('logs')
            .clickTab('results')
            .verifyTab('results')
        ;
    });

    // test filtering
    it(`should allow filtering`, () => {
        viewValidationDetailsPage
            .openTableFilterPanel();

        // test check and uncheck attributes filtering box
        cy.wrap(attrs).each((e, i, a) => {
            viewValidationDetailsPage
                .checkFilterCheckbox(attrs[i], false)
                .verifyAttributeCellExists(attrs[i], false)
                .checkFilterCheckbox(attrs[i], true)
                .verifyAttributeCellExists(attrs[i], true)
            return cy.wait(1000);
        });
    });

    // test ordering
    it(`should allow ordering`, () => {
        viewValidationDetailsPage
            .openTableFilterPanel();

        // test ordering attributes up and down
        cy.wrap(attrs).each((e, i, a) => {
            if (i == (a.length - 1)) { // the last, move up then down
                viewValidationDetailsPage
                    .moveAttributeFilterOrderUp(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i-1)
                    .moveAttributeFilterOrderDown(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i)
            } else { // the rest, move down then up
                viewValidationDetailsPage
                    .moveAttributeFilterOrderDown(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i+1)
                    .moveAttributeFilterOrderUp(attrs[i])
                    .verifyAttributeCellOrder(attrs[i], i)
            }
            return cy.wait(1000);
        });
    });

    // test expanding item-1, and should see children of it
    it(`test expanding and collapsing table item`, () => {
        viewValidationDetailsPage
            .expandRow('Item-1')
            .verifyItemExists('Item-1-1')
            .verifyItemExists('Item-1-2')
            .collapseRow('Item-1')
            .verifyItemNotExists('Item-1-1')
            .verifyItemNotExists('Item-1-2')
    });

    // test editing item name, description and attribute values
    it(`should allow editing item name, description and attribute values`, () => {
        const itemName = `Item-3`;

        const string_attributeName = `string attribute`;
        const string_attributeValue = `some string Item-3 ${Math.random()}`;
        const string_v = string_attributeValue;

        const text_attributeName = `text attribute`;
        const text_attributeValue = `some text Item-3 ${Math.random()}`;
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

        viewValidationDetailsPage
            // string
            .clickTableAttribute(itemName, string_attributeName)
            .editStringAttribute(string_attributeValue)
            .clickOk()

            // text
            .clickTableAttribute(itemName, text_attributeName)
            .editTextAttribute(text_attributeValue)
            .clickOk()

            // numeric
            .clickTableAttribute(itemName, number_attributeName)
            .editNumericAttribute(Number(number_attributeValue))
            .clickOk()

            // date
            .clickTableAttribute(itemName, date_attributeName)
            .editDateAttribute(date_attributeValue)
            .clickOk()

            // currency
            .clickTableAttribute(itemName, currency_attributeName)
            .editCurrencyAttribute(Number(currency_attributeValue), currency_attributeUnit)
            .clickOk()

            // volume
            .clickTableAttribute(itemName, volume_attributeName)
            .editVolumeAttribute(Number(volume_attributeValue), volume_attributeUnit)
            .clickOk()

            // dimension
            .clickTableAttribute(itemName, dimension_attributeName)
            .editDimensionAttribute(Number(dimension_attributeLengthValue), Number(dimension_attributeWidthValue), Number(dimension_attributeHeightValue), dimension_attributeUnit)
            .clickOk()

            // area
            .clickTableAttribute(itemName, area_attributeName)
            .editAreaAttribute(Number(area_attributeValue), area_attributeUnit)
            .clickOk()

            // length
            .clickTableAttribute(itemName, length_attributeName)
            .editLengthAttribute(Number(length_attributeValue), length_attributeUnit)
            .clickOk()

            // width
            .clickTableAttribute(itemName, width_attributeName)
            .editWidthAttribute(Number(width_attributeValue), width_attributeUnit)
            .clickOk()

            // height
            .clickTableAttribute(itemName, height_attributeName)
            .editHeightAttribute(Number(height_attributeValue), height_attributeUnit)
            .clickOk()

            // select
            .clickTableAttribute(itemName, select_attributeName)
            .editSelectAttribute(select_attributeValue)
            .clickOk()

            // doubleselect
            .clickTableAttribute(itemName, doubleselect_attributeName)
            .editDoubleSelectAttribute(doubleselect_attributeValue1, doubleselect_attributeValue2)
            .clickOk()
        ;

        viewValidationDetailsPage
            // string
            .verifyItemWithAttributeExists(itemName, string_attributeName, [string_attributeValue])

            // text
            .verifyItemWithAttributeExists(itemName, text_attributeName, [text_attributeValue])

            // numeric
            .verifyItemWithAttributeExists(itemName, number_attributeName, [number_attributeValue])

            // date
            .verifyItemWithAttributeExists(itemName, date_attributeName, [date_attributeValue])

            // currency
            .verifyItemWithAttributeExists(itemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])

            // volume
            .verifyItemWithAttributeExists(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .verifyItemWithAttributeExists(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .verifyItemWithAttributeExists(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // lenght
            .verifyItemWithAttributeExists(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .verifyItemWithAttributeExists(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .verifyItemWithAttributeExists(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .verifyItemWithAttributeExists(itemName, select_attributeName, [select_v])

            // doubleselect
            .verifyItemWithAttributeExists(itemName, doubleselect_attributeName, [doubleselect_v])
        ;

        viewValidationDetailsPage
            .clickSave()
            .verifySuccessMessageExists()
        ;

        // validate attributes value again
        viewValidationDetailsPage
        // string
            .verifyItemWithAttributeExists(itemName, string_attributeName, [string_attributeValue])

            // text
            .verifyItemWithAttributeExists(itemName, text_attributeName, [text_attributeValue])

            // numeric
            .verifyItemWithAttributeExists(itemName, number_attributeName, [number_attributeValue])

            // date
            .verifyItemWithAttributeExists(itemName, date_attributeName, [date_attributeValue])

            // currency
            .verifyItemWithAttributeExists(itemName, currency_attributeName, [currency_attributeValue, currency_attributeUnit])

            // volume
            .verifyItemWithAttributeExists(itemName, volume_attributeName, [volume_attributeValue, volume_attributeUnit])

            // dimension
            .verifyItemWithAttributeExists(itemName, dimension_attributeName, [dimension_attributeLengthValue, dimension_attributeWidthValue, dimension_attributeHeightValue, dimension_attributeUnit])

            // area
            .verifyItemWithAttributeExists(itemName, area_attributeName, [area_attributeValue, area_attributeUnit])

            // lenght
            .verifyItemWithAttributeExists(itemName, length_attributeName, [length_attributeValue, length_attributeUnit])

            // width
            .verifyItemWithAttributeExists(itemName, width_attributeName, [width_attributeValue, width_attributeUnit])

            // height
            .verifyItemWithAttributeExists(itemName, height_attributeName, [height_attributeValue, height_attributeUnit])

            // select
            .verifyItemWithAttributeExists(itemName, select_attributeName, [select_v])

            // doubleselect
            .verifyItemWithAttributeExists(itemName, doubleselect_attributeName, [doubleselect_v])
        ;

    });

    // test clicking items
    it(`should allow clicking on items`, () => {
        const itemName = `Item-3`;
        viewValidationDetailsPage
            .selectTableItem(itemName)
            .verifyTableItemSelected(itemName)
            .verifyTreeItemSelected(itemName)
            .verifyConsoleNotEmpty()
        ;
    });

    // test clicking tree items / rules
    it(`should allow click on tree items / rules`, () => {
        const itemName = `Item-2`
        viewValidationDetailsPage
            .selectTreeItem(itemName)
            .verifyTableItemSelected(itemName)
            .verifyTreeItemSelected(itemName)
            .verifyConsoleNotEmpty()
        ;
    });



});
