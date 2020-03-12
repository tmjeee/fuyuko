import {LoginPage} from "./page-object/login.page";
import {BulkEditPage} from "./page-object/bulk-edit.page";
import {ViewPage} from "./page-object/view.page";
import {ViewViewPage} from "./page-object/sub-page-object/view-view.page";
import {
    AreaOperatorType,
    CurrencyOperatorType,
    DateOperatorType, DimensionOperatorType, DoubleselectOperatorType, HeightOperatorType, LengthOperatorType,
    NumberOperatorType, SelectOperatorType,
    StringOperatorType,
    TextOperatorType, VolumeOperatorType, WidthOperatorType
} from "./model/operator.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "./model/unit.model";

describe(`bulk edit spec`, () => {

    let bulkEditPage: BulkEditPage;

    // ==== variables ====
    // string
    let string_whenAttributeName: string;
    let string_whenOp: StringOperatorType;
    let string_whenValue: string;
    let string_changeAttributeName: string;
    let string_changeAttributeValue: string;

    // text
    let text_whenAttributeName: string;
    let text_whenOp: TextOperatorType;
    let text_whenValue: string;
    let text_changeAttributeName: string;
    let text_changeAttributeValue: string;

    // number
    let number_whenAttributeName: string;
    let number_whenOp: NumberOperatorType
    let number_whenValue: number = 9999;
    let number_changeAttributeName: string;
    let number_changeAttributeValue: string;

    // date
    let date_whenAttributeName: string;
    let date_whenOp: DateOperatorType;
    let date_whenValue: string;
    let date_changeAttributeName: string;
    let date_changeAttributeValue: string;

    // currency
    let currency_whenAttributeName: string;
    let currency_whenOp: CurrencyOperatorType;
    let currency_whenValue: number;
    let currency_whenUnit: CountryCurrencyUnits;
    let currency_changeAttributeName: string;
    let currency_changeAttributeValue: string;
    let currency_changeAttributeUnit: CountryCurrencyUnits;

    // volume
    let volume_whenAttributeName: string;
    let volume_whenOp: VolumeOperatorType;
    let volume_whenValue: number;
    let volume_whenUnit: VolumeUnits;
    let volume_changeAttributeName: string;
    let volume_changeAttributeValue: string;
    let volume_changeAttributeUnit: VolumeUnits;

    // dimension
    let dimension_whenAttributeName: string;
    let dimension_whenOp: DimensionOperatorType;
    let dimension_whenLengthValue: number;
    let dimension_whenWidthValue: number;
    let dimension_whenHeightValue: number;
    let dimension_whenUnit: DimensionUnits;
    let dimension_changeAttributeName: string;
    let dimension_changeAttributeLengthValue: string;
    let dimension_changeAttributeWidthValue: string;
    let dimension_changeAttributeHeightValue: string;
    let dimension_changeAttributeUnit: DimensionUnits;

    // area
    let area_whenAttributeName: string;
    let area_whenOp: AreaOperatorType;
    let area_whenValue: number;
    let area_whenUnit: AreaUnits;
    let area_changeAttributeName: string;
    let area_changeAttributeValue: string;
    let area_changeAttributeUnit: AreaUnits;

    // length
    let length_whenAttributeName: string = `length attribute`;
    let length_whenOp: LengthOperatorType;
    let length_whenValue: number;
    let length_whenUnit: LengthUnits;
    let length_changeAttributeName: string;
    let length_changeAttributeValue: string;
    let length_changeAttributeUnit: LengthUnits;

    // width
    let width_whenAttributeName: string;
    let width_whenOp: WidthOperatorType;
    let width_whenValue: number;
    let width_whenUnit: WidthUnits;
    let width_changeAttributeName: string;
    let width_changeAttributeValue: string;
    let width_changeAttributeUnit: WidthUnits;

    // height
    let height_whenAttributeName: string;
    let height_whenOp: HeightOperatorType;
    let height_whenValue: number;
    let height_whenUnit: HeightUnits;
    let height_changeAttributeName: string;
    let height_changeAttributeValue: string;
    let height_changeAttributeUnit: HeightUnits;

    // select
    let select_whenAttributeName: string;
    let select_whenOp: SelectOperatorType;
    let select_whenValue: string;
    let select_whenValue_forVerification: string;
    let select_changeAttributeName: string;
    let select_changeAttributeValue: string;
    let select_changeAttributeValue_forVerification: string;

    // doubleselect
    let doubleselect_whenAttributeName: string;
    let doubleselect_whenOp: DoubleselectOperatorType;
    let doubleselect_whenValue1: string;
    let doubleselect_whenValue2: string;
    let doubleselect_whenValue1_forVerification: string;
    let doubleselect_whenValue2_forVerification: string;
    let doubleselect_changeAttributeName: string;
    let doubleselect_changeAttributeValue1: string;
    let doubleselect_changeAttributeValue2: string;
    let doubleselect_changeAttributeValue1_forVerification: string;
    let doubleselect_changeAttributeValue2_forVerification: string;

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

    const refreshVariables = () => {

        // string
        string_whenAttributeName= `string attribute`;
        string_whenOp = `not contain`;
        string_whenValue = `xxx`;
        string_changeAttributeName= `string attribute`;
        string_changeAttributeValue = `string-value-${Math.random()}`;

        // text
        text_whenAttributeName= `text attribute`;
        text_whenOp = `not contain`;
        text_whenValue = `xxx`;
        text_changeAttributeName= `text attribute`;
        text_changeAttributeValue = `text value-${Math.random()}`;

        // number
        number_whenAttributeName= `number attribute`;
        number_whenOp = `not eq`;
        number_whenValue = 9999;
        number_changeAttributeName= `number attribute`;
        number_changeAttributeValue = ((Math.random() + 1).toFixed(1));

        // date
        date_whenAttributeName= `date attribute`;
        date_whenOp = `not eq`;
        date_whenValue = `10-10-1999`;
        date_changeAttributeName= `date attribute`;
        date_changeAttributeValue = `0${(Math.random() * 8 + 1).toFixed(0)}-0${(Math.random() * 8 + 1).toFixed(0)}-${2000 + Number((Math.random() * 10).toFixed(0))}`;

        // currency
        currency_whenAttributeName= `currency attribute`;
        currency_whenOp = `not eq`;
        currency_whenValue = 1.10;
        currency_whenUnit = `AUD`;
        currency_changeAttributeName= `currency attribute`;
        currency_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(2));
        currency_changeAttributeUnit = 'AUD'

        // volume
        volume_whenAttributeName= `volume attribute`;
        volume_whenOp = `not eq`;
        volume_whenValue = 1.10;
        volume_whenUnit = `ml`;
        volume_changeAttributeName= `volume attribute`;
        volume_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        volume_changeAttributeUnit = 'ml';

        // dimension
        dimension_whenAttributeName= `dimension attribute`;
        dimension_whenOp = `not eq`;
        dimension_whenLengthValue = 1.10;
        dimension_whenWidthValue = 1.10;
        dimension_whenHeightValue = 1.10;
        dimension_whenUnit = `cm`;
        dimension_changeAttributeName= `dimension attribute`;
        dimension_changeAttributeLengthValue = ((Math.random() * 10 + 2).toFixed(1));
        dimension_changeAttributeWidthValue = ((Math.random() * 10 + 2).toFixed(1));
        dimension_changeAttributeHeightValue = ((Math.random() * 10 + 2).toFixed(1));
        dimension_changeAttributeUnit = 'cm';

        // area
        area_whenAttributeName= `area attribute`;
        area_whenOp = `not eq`;
        area_whenValue = 1.10;
        area_whenUnit = `m2`;
        area_changeAttributeName= `area attribute`;
        area_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        area_changeAttributeUnit = 'm2';

        // length
        length_whenAttributeName= `length attribute`;
        length_whenOp = `not eq`;
        length_whenValue = 1.10;
        length_whenUnit = 'cm';
        length_changeAttributeName= `length attribute`;
        length_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        length_changeAttributeUnit = 'cm';

        // width
        width_whenAttributeName= `width attribute`;
        width_whenOp = `not eq`;
        width_whenValue = 1.10;
        width_whenUnit = 'cm';
        width_changeAttributeName= `width attribute`;
        width_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        width_changeAttributeUnit = 'cm';

        // height
        height_whenAttributeName= `height attribute`;
        height_whenOp = `not eq`;
        height_whenValue = 1.10;
        height_whenUnit = 'cm';
        height_changeAttributeName= `height attribute`;
        height_changeAttributeValue = ((Math.random() * 10 + 2).toFixed(1));
        height_changeAttributeUnit = 'cm';

        // select
        select_whenAttributeName= `select attribute`;
        select_whenOp = `not eq`;
        select_whenValue = `key1`;
        select_whenValue_forVerification = `value1`;
        select_changeAttributeName = `select attribute`;
        select_changeAttributeValue = `key3`;
        select_changeAttributeValue_forVerification = `value3`;

        // doubleselect
        doubleselect_whenAttributeName= `doubleselect attribute`;
        doubleselect_whenOp = `not eq`;
        doubleselect_whenValue1 = `key1`;
        doubleselect_whenValue2 = `xkey11`;
        doubleselect_whenValue1_forVerification = `value1`;
        doubleselect_whenValue2_forVerification = `xvalue11`;
        doubleselect_changeAttributeName= `doubleselect attribute`;
        doubleselect_changeAttributeValue1 = `key2`
        doubleselect_changeAttributeValue2 = `xkey22`
        doubleselect_changeAttributeValue1_forVerification = `value2`
        doubleselect_changeAttributeValue2_forVerification = `xvalue22`

    }

    const createNewView = (): string => {
        const r = Math.random();
        const viewName = `New-View-${r}`;
        const viewDescription = `New-View-Description-${r}`;
        const viewViewPage: ViewViewPage = new ViewPage()
                .visitViews()
                .validateTitle()
                .clickAdd()
                .editName(viewName)
                .editDescription(viewDescription)
                .clickOk()
                .clickSave()
            ;

        cy.wait(100).then((_) => {
            viewViewPage.verifySuccessMessageExists();
        });

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

    it(`should allow switching in where and change clause`, () => {
        const i = 0;
        const viewName = `Test View 1`;  // createNewView();
        refreshVariables();

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
            .verifyWhereClauseText(i, text_whenAttributeName, text_whenOp, text_whenValue)
            .verifyChangeClauseText(i, text_changeAttributeName, text_changeAttributeValue)

            // number
            .editWhereNumber(i, number_whenAttributeName, number_whenOp, number_whenValue)
            .editChangeNumber(i, number_changeAttributeName, Number(number_changeAttributeValue))
            .verifyWhereClauseNumber(i, number_whenAttributeName, number_whenOp, number_whenValue)
            .verifyChangeClauseNumber(i, number_changeAttributeName, Number(number_changeAttributeValue))

            // date
            .editWhereDate(i, date_whenAttributeName, date_whenOp, date_whenValue)
            .editChangeDate(i, date_changeAttributeName, date_changeAttributeValue)
            .verifyWhereClauseDate(i, date_whenAttributeName, date_whenOp, date_whenValue)
            .verifyChangeClauseDate(i, date_changeAttributeName, date_changeAttributeValue)

            // currency
            .editWhereCurrency(i, currency_whenAttributeName, currency_whenOp, currency_whenValue, currency_whenUnit)
            .editChangeCurrency(i, currency_changeAttributeName, Number(currency_changeAttributeValue), currency_changeAttributeUnit)
            .verifyWhereClauseCurrency(i, currency_whenAttributeName, currency_whenOp, currency_whenValue, currency_whenUnit)
            .verifyChangeClauseCurrency(i, currency_changeAttributeName, Number(currency_changeAttributeValue), currency_changeAttributeUnit)

            // volume
            .editWhereVolume(i, volume_whenAttributeName, volume_whenOp, volume_whenValue, volume_whenUnit)
            .editChangeVolume(i, volume_changeAttributeName, Number(volume_changeAttributeValue), volume_changeAttributeUnit)
            .verifyWhereClauseVolume(i, volume_whenAttributeName, volume_whenOp, volume_whenValue, volume_whenUnit)
            .verifyChangeClauseVolume(i, volume_changeAttributeName, Number(volume_changeAttributeValue), volume_changeAttributeUnit)

            // dimension
            .editWhereDimension(i, dimension_whenAttributeName, dimension_whenOp, dimension_whenLengthValue, dimension_whenWidthValue, dimension_whenHeightValue, dimension_whenUnit)
            .editChangeDimension(i, dimension_changeAttributeName, Number(dimension_changeAttributeLengthValue), Number(dimension_changeAttributeWidthValue), Number(dimension_changeAttributeHeightValue), dimension_changeAttributeUnit)
            .verifyWhereClauseDimension(i, dimension_whenAttributeName, dimension_whenOp, dimension_whenLengthValue, dimension_whenWidthValue, dimension_whenHeightValue, dimension_whenUnit)
            .verifyChangeClauseDimension(i, dimension_changeAttributeName, Number(dimension_changeAttributeLengthValue), Number(dimension_changeAttributeWidthValue), Number(dimension_changeAttributeHeightValue), dimension_changeAttributeUnit)

            // area
            .editWhereArea(i, area_whenAttributeName, area_whenOp, area_whenValue, area_whenUnit)
            .editChangeArea(i, area_changeAttributeName, Number(area_changeAttributeValue), area_changeAttributeUnit)
            .verifyWhereClauseArea(i, area_whenAttributeName, area_whenOp, area_whenValue, area_whenUnit)
            .verifyChangeClauseArea(i, area_changeAttributeName, Number(area_changeAttributeValue), area_changeAttributeUnit)

            // length
            .editWhereLength(i, length_whenAttributeName, length_whenOp, length_whenValue, length_whenUnit)
            .editChangeLength(i, length_changeAttributeName, Number(length_changeAttributeValue), length_changeAttributeUnit)
            .verifyWhereClauseLength(i, length_whenAttributeName, length_whenOp, length_whenValue, length_whenUnit)
            .verifyChangeClauseLength(i, length_changeAttributeName, Number(length_changeAttributeValue), length_changeAttributeUnit)

            // width
            .editWhereWidth(i, width_whenAttributeName, width_whenOp, length_whenValue, width_whenUnit)
            .editChangeWidth(i, width_changeAttributeName, Number(width_changeAttributeValue), width_changeAttributeUnit)
            .verifyWhereClauseWidth(i, width_whenAttributeName, width_whenOp, length_whenValue, width_whenUnit)
            .verifyChangeClauseWidth(i, width_changeAttributeName, Number(width_changeAttributeValue), width_changeAttributeUnit)

            // height
            .editWhereHeight(i, height_whenAttributeName, height_whenOp, length_whenValue, height_whenUnit)
            .editChangeHeight(i, height_changeAttributeName, Number(height_changeAttributeValue), height_changeAttributeUnit)
            .verifyWhereClauseHeight(i, height_whenAttributeName, height_whenOp, length_whenValue, height_whenUnit)
            .verifyChangeClauseHeight(i, height_changeAttributeName, Number(height_changeAttributeValue), height_changeAttributeUnit)

            // select
            .editWhereSelect(i, select_whenAttributeName, select_whenOp, select_whenValue)
            .editChangeSelect(i, select_changeAttributeName, select_changeAttributeValue)
            .verifyWhereClauseSelect(i, select_whenAttributeName, select_whenOp, select_whenValue_forVerification)
            .verifyChangeClauseSelect(i, select_changeAttributeName, select_changeAttributeValue_forVerification)

            // doubleselect
            .editWhereDoubleselect(i, doubleselect_whenAttributeName, doubleselect_whenOp, doubleselect_whenValue1, doubleselect_whenValue2)
            .editChangeDoubleselect(i, doubleselect_changeAttributeName, doubleselect_changeAttributeValue1, doubleselect_changeAttributeValue2)
            .verifyWhereClauseDoubleselect(i, doubleselect_whenAttributeName, doubleselect_whenOp, doubleselect_whenValue1_forVerification, doubleselect_whenValue2_forVerification)
            .verifyChangeClauseDoubleselect(i, doubleselect_changeAttributeName, doubleselect_changeAttributeValue1_forVerification, doubleselect_changeAttributeValue2_forVerification)
        ;
    });

    it.only (`should allow bulk edit process`, () => {

        let i = 0;
        const viewName = `Test View 1`;  // createNewView();
        refreshVariables();
        const increment = () => {
            i += 1;
        };

        const bulkEditPageStep1 = bulkEditPage
            .visit()
            .startWizard()
            .verifyStep()
        ;

        // string
        bulkEditPageStep1
            .editWhereString(i, string_whenAttributeName, string_whenOp, string_whenValue)
            .editChangeString(i, string_changeAttributeName, string_changeAttributeValue)
            .verifyWhereClauseString(i, string_whenAttributeName, string_whenOp, string_whenValue)
            .verifyChangeClauseString(i, string_changeAttributeName, string_changeAttributeValue)
        ;

        cy.wrap({i: increment}).invoke('i').then((_) => {
            // text
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereText(i, text_whenAttributeName, text_whenOp, text_whenValue)
                .editChangeText(i, text_changeAttributeName, text_changeAttributeValue)
                .verifyWhereClauseText(i, text_whenAttributeName, text_whenOp, text_whenValue)
                .verifyChangeClauseText(i, text_changeAttributeName, text_changeAttributeValue)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // number
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereNumber(i, number_whenAttributeName, number_whenOp, number_whenValue)
                .editChangeNumber(i, number_changeAttributeName, Number(number_changeAttributeValue))
                .verifyWhereClauseNumber(i, number_whenAttributeName, number_whenOp, number_whenValue)
                .verifyChangeClauseNumber(i, number_changeAttributeName, Number(number_changeAttributeValue))
            ;
        });

        cy.wrap({i: increment}).invoke('i').then((_) => {
            // date
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereDate(i, date_whenAttributeName, date_whenOp, date_whenValue)
                .editChangeDate(i, date_changeAttributeName, date_changeAttributeValue)
                .verifyWhereClauseDate(i, date_whenAttributeName, date_whenOp, date_whenValue)
                .verifyChangeClauseDate(i, date_changeAttributeName, date_changeAttributeValue)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // currency
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereCurrency(i, currency_whenAttributeName, currency_whenOp, currency_whenValue, currency_whenUnit)
                .editChangeCurrency(i, currency_changeAttributeName, Number(currency_changeAttributeValue), currency_changeAttributeUnit)
                .verifyWhereClauseCurrency(i, currency_whenAttributeName, currency_whenOp, currency_whenValue, currency_whenUnit)
                .verifyChangeClauseCurrency(i, currency_changeAttributeName, Number(currency_changeAttributeValue), currency_changeAttributeUnit)
            ;
        });



        cy.wrap({i: increment}).invoke('i').then((_) => {
            // volume
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereVolume(i, volume_whenAttributeName, volume_whenOp, volume_whenValue, volume_whenUnit)
                .editChangeVolume(i, volume_changeAttributeName, Number(volume_changeAttributeValue), volume_changeAttributeUnit)
                .verifyWhereClauseVolume(i, volume_whenAttributeName, volume_whenOp, volume_whenValue, volume_whenUnit)
                .verifyChangeClauseVolume(i, volume_changeAttributeName, Number(volume_changeAttributeValue), volume_changeAttributeUnit)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // dimension
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereDimension(i, dimension_whenAttributeName, dimension_whenOp, dimension_whenLengthValue, dimension_whenWidthValue, dimension_whenHeightValue, dimension_whenUnit)
                .editChangeDimension(i, dimension_changeAttributeName, Number(dimension_changeAttributeLengthValue), Number(dimension_changeAttributeWidthValue), Number(dimension_changeAttributeHeightValue), dimension_changeAttributeUnit)
                .verifyWhereClauseDimension(i, dimension_whenAttributeName, dimension_whenOp, dimension_whenLengthValue, dimension_whenWidthValue, dimension_whenHeightValue, dimension_whenUnit)
                .verifyChangeClauseDimension(i, dimension_changeAttributeName, Number(dimension_changeAttributeLengthValue), Number(dimension_changeAttributeWidthValue), Number(dimension_changeAttributeHeightValue), dimension_changeAttributeUnit)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // area
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereArea(i, area_whenAttributeName, area_whenOp, area_whenValue, area_whenUnit)
                .editChangeArea(i, area_changeAttributeName, Number(area_changeAttributeValue), area_changeAttributeUnit)
                .verifyWhereClauseArea(i, area_whenAttributeName, area_whenOp, area_whenValue, area_whenUnit)
                .verifyChangeClauseArea(i, area_changeAttributeName, Number(area_changeAttributeValue), area_changeAttributeUnit)
            ;
        });

        cy.wrap({i: increment}).invoke('i').then((_) => {
            // length
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereLength(i, length_whenAttributeName, length_whenOp, length_whenValue, length_whenUnit)
                .editChangeLength(i, length_changeAttributeName, Number(length_changeAttributeValue), length_changeAttributeUnit)
                .verifyWhereClauseLength(i, length_whenAttributeName, length_whenOp, length_whenValue, length_whenUnit)
                .verifyChangeClauseLength(i, length_changeAttributeName, Number(length_changeAttributeValue), length_changeAttributeUnit)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // width
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereWidth(i, width_whenAttributeName, width_whenOp, length_whenValue, width_whenUnit)
                .editChangeWidth(i, width_changeAttributeName, Number(width_changeAttributeValue), width_changeAttributeUnit)
                .verifyWhereClauseWidth(i, width_whenAttributeName, width_whenOp, length_whenValue, width_whenUnit)
                .verifyChangeClauseWidth(i, width_changeAttributeName, Number(width_changeAttributeValue), width_changeAttributeUnit)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // height
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereHeight(i, height_whenAttributeName, height_whenOp, length_whenValue, height_whenUnit)
                .editChangeHeight(i, height_changeAttributeName, Number(height_changeAttributeValue), height_changeAttributeUnit)
                .verifyWhereClauseHeight(i, height_whenAttributeName, height_whenOp, length_whenValue, height_whenUnit)
                .verifyChangeClauseHeight(i, height_changeAttributeName, Number(height_changeAttributeValue), height_changeAttributeUnit)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // select
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereSelect(i, select_whenAttributeName, select_whenOp, select_whenValue)
                .editChangeSelect(i, select_changeAttributeName, select_changeAttributeValue)
                .verifyWhereClauseSelect(i, select_whenAttributeName, select_whenOp, select_whenValue_forVerification)
                .verifyChangeClauseSelect(i, select_changeAttributeName, select_changeAttributeValue_forVerification)
            ;
        });


        cy.wrap({i: increment}).invoke('i').then((_) => {
            // doubleselect
            bulkEditPageStep1
                .clickAddChangeClause()
                .clickAddWhenClause()
                .editWhereDoubleselect(i, doubleselect_whenAttributeName, doubleselect_whenOp, doubleselect_whenValue1, doubleselect_whenValue2)
                .editChangeDoubleselect(i, doubleselect_changeAttributeName, doubleselect_changeAttributeValue1, doubleselect_changeAttributeValue2)
                .verifyWhereClauseDoubleselect(i, doubleselect_whenAttributeName, doubleselect_whenOp, doubleselect_whenValue1_forVerification, doubleselect_whenValue2_forVerification)
                .verifyChangeClauseDoubleselect(i, doubleselect_changeAttributeName, doubleselect_changeAttributeValue1_forVerification, doubleselect_changeAttributeValue2_forVerification)
            ;
        });

        let itemName = `Item-1`;
        const bulkEditPageStep2 = bulkEditPageStep1.clickNext()
            .verifyStep()
            .verifyItemNewValue(itemName, string_changeAttributeName, [string_changeAttributeValue])
            .verifyItemWhereCause(itemName, string_whenAttributeName, [string_whenOp, string_whenValue])

            .verifyItemNewValue(itemName, text_changeAttributeName, [text_changeAttributeValue])
            .verifyItemWhereCause(itemName, text_whenAttributeName, [text_whenOp, text_whenValue])

            .verifyItemNewValue(itemName, number_changeAttributeName, [number_changeAttributeValue])
            .verifyItemWhereCause(itemName, number_whenAttributeName, [number_whenOp, String(number_whenValue)])

            .verifyItemNewValue(itemName, date_changeAttributeName, [date_changeAttributeValue])
            .verifyItemWhereCause(itemName, date_whenAttributeName, [date_whenOp, String(date_whenValue)])

            .verifyItemNewValue(itemName, currency_changeAttributeName, [currency_changeAttributeValue])
            .verifyItemWhereCause(itemName, currency_whenAttributeName, [currency_whenOp, String(currency_whenValue)])

            .verifyItemNewValue(itemName, volume_changeAttributeName, [volume_changeAttributeValue])
            .verifyItemWhereCause(itemName, volume_whenAttributeName, [volume_whenOp, String(volume_whenValue)])

            .verifyItemNewValue(itemName, dimension_changeAttributeName, [dimension_changeAttributeLengthValue, dimension_changeAttributeWidthValue, dimension_changeAttributeHeightValue])
            .verifyItemWhereCause(itemName, dimension_whenAttributeName, [dimension_whenOp, String(dimension_whenLengthValue), String(dimension_whenWidthValue), String(dimension_whenHeightValue)])

            .verifyItemNewValue(itemName, area_changeAttributeName, [area_changeAttributeValue])
            .verifyItemWhereCause(itemName, area_whenAttributeName, [area_whenOp, String(area_whenValue)])

            .verifyItemNewValue(itemName, length_changeAttributeName, [length_changeAttributeValue])
            .verifyItemWhereCause(itemName, length_whenAttributeName, [length_whenOp, String(length_whenValue)])

            .verifyItemNewValue(itemName, width_changeAttributeName, [width_changeAttributeValue])
            .verifyItemWhereCause(itemName, width_whenAttributeName, [width_whenOp, String(width_whenValue)])

            .verifyItemNewValue(itemName, height_changeAttributeName, [height_changeAttributeValue])
            .verifyItemWhereCause(itemName, height_whenAttributeName, [height_whenOp, String(height_whenValue)])

            .verifyItemNewValue(itemName, select_changeAttributeName, [select_changeAttributeValue])
            .verifyItemWhereCause(itemName, select_whenAttributeName, [select_whenOp, String(select_whenValue)])

            .verifyItemNewValue(itemName, doubleselect_changeAttributeName, [doubleselect_changeAttributeValue1, doubleselect_changeAttributeValue2])
            .verifyItemWhereCause(itemName, doubleselect_whenAttributeName, [doubleselect_whenOp, String(doubleselect_whenValue1), String(doubleselect_whenValue2)])
        ;
    });
});
