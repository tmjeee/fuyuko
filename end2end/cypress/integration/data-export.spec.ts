import {LoginPage} from "./page-object/login.page";
import {ExportArtifactsPage} from "./page-object/sub-page-object/export-artifacts.page";
import {
    ExportPage,
    ExportPageStep1,
    ExportPageStep2,
    ExportPageStep3,
    ExportPageStep4, ExportPageStep5
} from "./page-object/sub-page-object/export.page";

describe(`data export spec`, () => {

    let exportPage: ExportPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        exportPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitExportPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        exportPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        exportPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////
    it('should export prices', () => {

    }) ;


    it.only(`should export items`, () => {

        const viewName = `Test View 1`;
        const itemName = `Item-1`;

        exportPage
            .visit();


        // step 1
        const exportPageStep1: ExportPageStep1 = exportPage
            .clickStep1()
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectExportView(viewName)
            .verifyCanClickNext(true)
        ;


        // step 2
        const exportPageStep2: ExportPageStep2 = exportPageStep1
            .clickNext()
            .verifyInStep()
            .clickBack()        // step1
            .verifyInStep()
            .clickNext()        // step2
            .verifyInStep()
            .selectExportType('ITEM')
            .selectExportAllAttributes()
        ;


        // step 3 (item filtering)
        const exportPageStep3: ExportPageStep3 = exportPageStep2
            .clickNext() as ExportPageStep3;
        exportPageStep3
            .verifyInStep()
            .clickBack()       // step 2
            .verifyInStep()
            .clickNext()       // step 3
            .verifyInStep()


        // step 4 (review)
        const exportPageStep4: ExportPageStep4 = exportPageStep3
            .clickNext()
            .verifyInStep();
        const _exportPageStep3: ExportPageStep3 = exportPageStep4
            .clickBack()
            .verifyInStep() as ExportPageStep3;
        exportPageStep3
            .clickNext()
        exportPageStep4
            .expandItem(itemName)
            .verifyItemExport_itemExists(itemName)
            .verifyItemExport_itemExists(`Item1-1`)
            .verifyItemExport_itemExists(`Item1-2`)
            .verifyItemExport_itemExists(`Item-2`)
            .verifyItemExport_itemExists(`Item-3`)
            .verifyItemExport_itemExists(`Item-4`)
            .verifyItemExport_itemExists(`Item-5`)
            .verifyItemExport_itemExists(`Item-6`)
            .verifyItemExport_itemExists(`Item-7`)
            .verifyItemExport_itemAttributeValue(itemName, `string attribute`, ['some string'])
            .verifyItemExport_itemAttributeValue(itemName, `text attribute`, ['some text'])
        ;

        // step 5
        const exportPageStep5: ExportPageStep5 = exportPageStep4
            .clickNext()
            .verifyInStep()
        ;
        cy.wait(1000);
        exportPageStep5.clickDone();


        const exportArtifactsPage = new ExportArtifactsPage()
            .visit()
            .validateTitle()
            .verifyName(0, 'attribute-item-export')
            .verifyViewMimeType(0, 'text/csv')
            .verifyViewName(0, viewName)
        ;
    });


    it(`should export attributes`, () => {

        const viewName =  `Test View 1`;

        exportPage
            .visit();

            // step 1
        const exportPageStep1: ExportPageStep1 = exportPage
            .clickStep1()
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectExportView(viewName)
            .verifyCanClickNext(true)
        ;

            // step 2
        const exportPageStep2: ExportPageStep2 = exportPageStep1
            .clickNext()
            .verifyInStep()
            .clickBack()        // step1
            .verifyInStep()
            .clickNext()        // step2
            .verifyInStep()
            .selectExportType('ATTRIBUTE')
            .selectExportAllAttributes()
        ;

            // step 4 (attribute export has no step3)
        const exportPageStep4: ExportPageStep4 = exportPageStep2
            .clickNext() as ExportPageStep4;

        exportPageStep4
            .verifyInStep()
            .clickBack()       // step 2
            .verifyInStep()
            .clickNext()       // step 4
            .verifyInStep()
        ;
        exportPageStep4
            .verifyAttributeExport_attributeExists(`string attribute`, `string`)
            .verifyAttributeExport_attributeExists(`text attribute`, `text`)
            .verifyAttributeExport_attributeExists(`number attribute`, `number`)
            .verifyAttributeExport_attributeExists(`date attribute`, `date`)
            .verifyAttributeExport_attributeExists(`currency attribute`, `currency`)
            .verifyAttributeExport_attributeExists(`volume attribute`, `volume`)
            .verifyAttributeExport_attributeExists(`dimension attribute`, `dimension`)
            .verifyAttributeExport_attributeExists(`area attribute`, `area`)
            .verifyAttributeExport_attributeExists(`length attribute`, `length`)
            .verifyAttributeExport_attributeExists(`width attribute`, `width`)
            .verifyAttributeExport_attributeExists(`height attribute`, `height`)
            .verifyAttributeExport_attributeExists(`select attribute`, `select`)
            .verifyAttributeExport_attributeExists(`doubleselect attribute`, `doubleselect`)
        ;

            // step 5
        const exportPageStep5 = exportPageStep4
            .clickNext()
            .verifyInStep()
        ;

        cy.wait(1000);
        exportPageStep5
            .clickDone()
        ;

        const exportArtifactsPage = new ExportArtifactsPage()
            .visit()
            .validateTitle()
            .verifyName(0, 'attribute-data-export')
            .verifyViewMimeType(0, 'text/csv')
            .verifyViewName(0, viewName)
        ;
    });
});
