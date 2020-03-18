import {LoginPage} from "./page-object/login.page";
import {ImportPage, ImportPageStep4} from "./page-object/sub-page-object/import.page";
import {createNewView, deleteView} from "./util/util";

describe(`data import spec`, () => {

    let importPage: ImportPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        importPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitImportPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        importPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        importPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it.only(`should be able to import attribute`, () => {

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

        ;


        // deleteView(viewName);
    });



    it(`should be able to import items`, () => {


    });
});
