import {LoginPage} from "../page-object/login.page";
import {ImportPage, ImportPageStep4} from "../page-object/sub-page-object/import.page";
import {createNewView, deleteView} from "../util/util";
import {PricingPage} from "../page-object/pricing.page";

describe(`data import spec`, () => {

    let importPage: ImportPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // importPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitImportExportPage()
        //     .visitImportPage();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        importPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitImportPage();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        importPage
            .validateTitle()
        ;
    });

    //////////////////

    it(`should be able to import attribute, items and prices`, () => {

        // const viewName =  `Test View 1`; // createNewView();
        const viewName =  createNewView();

        // ===== attributes
        const importPageStep4: ImportPageStep4 = importPage
            .visit()
            // step 1
            .clickStep1()
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectImportView(viewName)
            .verifyCanClickNext(true)
            .clickNext()


            // step 2
            .verifyInStep()
            .clickBack()
            .verifyInStep()
            .clickNext()
            .verifyInStep()
            .selectImportType('ATTRIBUTE')
            .uploadFile(`./sample-import-attributes.csv`)
            .clickNext()

            // step 3
            .verifyInStep()
            .clickBack()
            .verifyInStep()
            .clickNext()
            .verifyAttributeImport_attributeExists(`att01`, `string`)
            .verifyAttributeImport_attributeExists(`att02`, `text`)
            .verifyAttributeImport_attributeExists(`att03`, `number`)
            .verifyAttributeImport_attributeExists(`att04`, `date`)
            .verifyAttributeImport_attributeExists(`att05`, `currency`)
            .verifyAttributeImport_attributeExists(`att06`, `volume`)
            .verifyAttributeImport_attributeExists(`att07`, `dimension`)
            .verifyAttributeImport_attributeExists(`att08`, `area`)
            .verifyAttributeImport_attributeExists(`att09`, `width`)
            .verifyAttributeImport_attributeExists(`att10`, `length`)
            .verifyAttributeImport_attributeExists(`att11`, `height`)
            .verifyAttributeImport_attributeExists(`att12`, `select`)
            .verifyAttributeImport_attributeExists(`att13`, `doubleselect`)

            // step 4
            .clickNext()
            .verifyInStep()
        ;

        cy.wait(100);

        importPageStep4
            .clickDone()
            .verifyInStep()
        ;



        // ================= ITEMS

        importPage
            .visit()
            .clickStep1()
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectImportView(viewName)
            .verifyCanClickNext(true)
            .clickNext()

            // step 2
            .verifyInStep()
            .clickBack()
            .verifyInStep()
            .clickNext()
            .selectImportType('ITEM')
            .uploadFile('./sample-import-items.csv')
            .clickNext()

            // step 3
            .verifyInStep()
            .verifyItemImport_itemExists(`item 1`)
            .verifyItemImport_itemAttributeValue(`item 1`, `att01`, [`some string`])
            .verifyItemImport_itemAttributeValue(`item 1`, `att02`, ['some text'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att03`, ['10.0'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att04`, ['10/09/2018'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att05`, ['$23.50'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att06`, ['11.1 l'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att07`, ['w:13.0 m', 'h:14.0 m', 'l:12.0 m'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att08`, ['11.0 m2'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att09`, ['33.0 m'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att10`, ['44.0 m'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att11`, ['55.0 m'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att12`, ['value2'])
            .verifyItemImport_itemAttributeValue(`item 1`, `att13`, ['value3 - xvalue31'])
            .verifyItemImport_itemVisible(`item 1_1`, false)
            .verifyItemImport_itemVisible(`item 1_1_1`, false)
            .verifyItemImport_itemVisible(`item 1_1_1_1`, false)
            .expandItem(`item 1`)
            .verifyItemImport_itemVisible(`item 1_1`, true)
            .verifyItemImport_itemVisible(`item 1_1_1`, true)
            .verifyItemImport_itemVisible(`item 1_1_1_1`, true)

            // step 4
            .clickNext()
            .verifyInStep()
        ;



        // ============================= PRICE

        const pricingStructureName = `PricingStructure1`;
        const pricingStructureDescription = `PricingStructure1 description `;

        // create pricing structure for view
        new PricingPage()
            .visit()
            .visitPricingStructurePage()
            .clickAddNewPricingStructure()
            .editName(pricingStructureName)
            .editDescription(pricingStructureDescription)
            .selectView(viewName)
            .clickOk()
            .verifySuccessMessageExists()
        ;


        // import price into view's pricing structure
        importPage
            .visit()
            .clickStep1()
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectImportView(viewName)
            .verifyCanClickNext(true)
            .clickNext()


            // step 2
            .verifyInStep()
            .clickBack()
            .verifyInStep()
            .clickNext()
            .selectImportType('PRICE')
            .uploadFile('./sample-import-prices.csv')
            .clickNext()


            // step 3
            .verifyInStep()
            .verifyPriceImport_price(`item 1`, ['20.50'])
            .verifyPriceImport_priceUnit(`item 1`, ['AUD'])
            .verifyPriceImport_price(`item 1_1`, ['10.10'])
            .verifyPriceImport_priceUnit(`item 1_1`, ['AUD'])

            // step 4
            .clickNext()
            .verifyInStep()
        ;

        deleteView(viewName);
    });
});
