import {LoginPage} from "./page-object/login.page";
import {BulkEditPage} from "./page-object/bulk-edit.page";
import {ViewPage} from "./page-object/view.page";

describe(`bulk edit spec`, () => {

    let bulkEditPage: BulkEditPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');

        // create new view
        bulkEditPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitBulkEditPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        bulkEditPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        bulkEditPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    const createNewView = (): string => {
        const r = Math.random();
        const viewName = `New-View-${r}`;
        const viewDescription = `New-View-Description-${r}`;
            new ViewPage()
                .visitViews()
                .validateTitle()
                .clickAdd()
                .editName(viewName)
                .editDescription(viewDescription)
                .clickOk()
                .clickSave()
                .verifySuccessMessageExists()
            ;
            return viewName;
    }

    const deleteView = (viewName: string) => {
        new ViewPage()
            .visitViews()
            .clickDelete([viewName])
            .clickSave()
            .verifySuccessMessageExists();
    }

    it (`should be able switch views`, () => {
        const testView1 = `Test View 1`;
        const testView2 = `Test View 2`;
        const testView3 = `Test View 3`;
        bulkEditPage
            .selectView(testView2)
            .verifySelectedView(testView2)
            .selectView(testView3)
            .verifySelectedView(testView3)
            .selectView(testView1)
            .verifySelectedView(testView1)
    });

    it.only(`should perform add and delete change and where clauses`, () => {
        const i = 0;
        const viewName = createNewView();

        // string
        const string_whenAttributeName: string = `string attribute`;
        const string_whenOp = `not contain`;
        const string_whenValue = `xxx`;
        const string_changeAttributeName: string = `string attribute`;
        const string_changeAttributeValue = `string-value-${Math.random()}`;

        // text
        const text_whenAttributeName: string = `text attribute`;
        const text_whenOp = `not contain`;
        const text_whenValue = `xxx`;
        const text_changeAttributeName: string = `text attribute`;
        const text_changeAttributeValue = `text value-${Math.random()}`;

        // number
        const number_whenAttributeName: string = `number attribute`;
        const number_whenOp = `not contain`;
        const number_whenValue = 9999;
        const number_changeAttributeName: string = `number attribute`;
        const number_changeAttributeValue = ((Math.random() + 1).toFixed(1));

        // date
        const date_whenAttributeName: string = `date attribute`;
        const date_whenOp = `not contain`;
        const date_whenValue = `10-10-1999`;
        const date_changeAttributeName: string = `date attribute`;
        const date_changeAttributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;

        // currency
        const currency_whenAttributeName: string = `number attribute`;
        const currency_whenOp = `not contain`;
        const currency_whenValue = 1.10;
        const currency_whenUnit = `AUD`;
        const currency_changeAttributeName: string = `number attribute`;
        const currency_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(2));
        const currency_changeAttributeUnit = 'AUD'

        // volume
        const volume_whenAttributeName: string = `volume attribute`;
        const volume_whenOp = `not contain`;
        const volume_whenValue = 1.10;
        const volume_whenUnit = `ml`;
        const volume_changeAttributeName: string = `volume attribute`;
        const volume_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        const volume_changeAttributeUnit = 'ml';

        // dimension
        const dimension_whenAttributeName: string = `dimension attribute`;
        const dimension_whenOp = `not contain`;
        const dimension_whenLengthValue = 1.10;
        const dimension_whenWidthValue = 1.10;
        const dimension_whenHeightValue = 1.10;
        const dimension_whenUnit = `cm`;
        const dimension_changeAttributeName: string = `dimension attribute`;
        const dimension_changeAttributeLengthValue = ((Math.random() * 10 + 2).toFixed(1));
        const dimension_changeAttributeWidthValue = ((Math.random() * 10 + 2).toFixed(1));
        const dimension_changeAttributeHeightValue = ((Math.random() * 10 + 2).toFixed(1));
        const dimension_changeAttributeUnit = 'cm';

        // area
        const area_whenAttributeName: string = `area attribute`;
        const area_whenOp = `not contain`;
        const area_whenValue = 1.10;
        const area_whenUnit = `m2`;
        const area_changeAttributeName: string = `area attribute`;
        const area_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        const area_changeAttributeUnit = 'm2';

        // length
        const length_whenAttributeName: string = `length attribute`;
        const length_whenOp = `not contain`;
        const length_whenValue = 1.10;
        const length_whenUnit = 'cm';
        const length_changeAttributeName: string = `length attribute`;
        const length_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        const length_changeAttributeUnit = 'cm';

        // width
        const width_whenAttributeName: string = `width attribute`;
        const width_whenOp = `not contain`;
        const width_whenValue = 1.10;
        const width_whenUnit = 'cm';
        const width_changeAttributeName: string = `width attribute`;
        const width_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        const width_changeAttributeUnit = 'cm';

        // height
        const height_whenAttributeName: string = `height attribute`;
        const height_whenOp = `not contain`;
        const height_whenValue = 1.10;
        const height_whenUnit = 'cm';
        const height_changeAttributeName: string = `height attribute`;
        const height_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        const height_changeAttributeUnit = 'cm';

        // select
        const select_whenAttributeName: string = `select attribute`;
        const select_whenOp = `not contain`;
        const select_whenValue = ``;
        const select_changeAttributeName: string = `select attribute`;
        const select_changeAttributeValue = `key3`;

        // doubleselect
        const doubleselect_whenAttributeName: string = `doubleselect attribute`;
        const doubleselect_whenOp = `not contain`;
        const doubleselect_whenValue = ``;
        const doubleselect_changeAttributeName: string = `doubleselect attribute`;
        const doubleselect_changeAttributeValue1 = `key2`
        const doubleselect_changeAttributeValue2 = `xkey22`

        bulkEditPage
            .visit()
            .startWizard()
            .verifyStep()

            // string
            .editWhereString(i, string_whenAttributeName, string_whenOp, string_whenValue)
            .editChangeString(i, string_changeAttributeName, string_changeAttributeValue)
            .verifyWhereClauseString(i, string_whenAttributeName, string_whenOp, string_whenValue)
            .verifyChangeClauseString(i, string_changeAttributeName, string_changeAttributeValue)

            // text
            .editWhereText(i, text_whenAttributeName, text_whenOp, text_whenValue)
            .editChangeText(i, text_changeAttributeName, text_changeAttributeValue)

            // number
            .editWhereNumber(i, number_whenAttributeName, number_whenOp, number_whenValue)
            .editChangeNumber(i, number_changeAttributeName, Number(number_changeAttributeValue))

            // date
            .editWhereDate(i, date_whenAttributeName, date_whenOp, date_whenValue)
            .editChangeDate(i, date_changeAttributeName, date_changeAttributeValue)

            // currency
            .editWhereCurrency(i, currency_whenAttributeName, currency_whenOp, currency_whenValue, currency_whenUnit)
            .editChangeCurrency(i, currency_changeAttributeName, Number(currency_changeAttributeValue), currency_changeAttributeUnit)

            // volume
            .editWhereVolume(i, volume_whenAttributeName, volume_whenOp, volume_whenValue, volume_whenUnit)
            .editChangeVolume(i, volume_changeAttributeName, Number(volume_changeAttributeValue), volume_changeAttributeUnit)

            // dimension
            .editWhereDimension(i, dimension_whenAttributeName, dimension_whenOp, dimension_whenLengthValue, dimension_whenWidthValue, dimension_whenHeightValue, dimension_whenUnit)
            .editChangeDimension(i, dimension_changeAttributeName, Number(dimension_changeAttributeLengthValue), Number(dimension_changeAttributeWidthValue), Number(dimension_changeAttributeLengthValue), dimension_changeAttributeUnit)

            // area
            .editWhereArea(i, area_whenAttributeName, area_whenOp, area_whenValue, area_whenUnit)
            .editChangeArea(i, area_changeAttributeName, Number(area_changeAttributeValue), area_changeAttributeUnit)

            // length
            .editWhereLength(i, length_whenAttributeName, length_whenOp, length_whenValue, length_whenUnit)
            .editChangeLength(i, length_changeAttributeName, Number(length_changeAttributeValue), length_changeAttributeUnit)

            // width
            .editWhereWidth(i, width_whenAttributeName, width_whenOp, length_whenValue, width_whenUnit)
            .editChangeWidth(i, width_changeAttributeName, Number(width_changeAttributeValue), width_changeAttributeUnit)

            // height
            // select
            // doubleselect


        ;
    });


});
