import {CustomImportPage} from "./page-object/sub-page-object/custom-import.page";
import {LoginPage} from "./page-object/login.page";
import {CustomExportPage} from "./page-object/sub-page-object/custom-export.page";
import {JobsPage} from "./page-object/jobs.page";


describe(`custom export spec`, () => {

    let customExportPage: CustomExportPage;


    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');

        // create new view
        customExportPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitImportExportPage()
            .visitCustomExportPage()
        ;
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        customExportPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        customExportPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it (`should go do export`, () => {
        const jobName = `0.0.1-sample-custom-export-1.js`;
        customExportPage
        // step 1
            .clickStep1()
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectCustomExport(jobName)
            .verifyCanClickNext(true)
            .clickNext()

            // step 2
            .verifyInStep()
            .verifyCanClickNext(false)
            .selectView(`Test View 1`)
            .verifyCanClickNext(true)
            .clickNext()

            // step 3
            .verifyInStep()
            .verifyCanClickNext(false)
            .editStringInputValue('string input', 'test')
            .editNumberInputValue('number input', '1')
            .editDateInputValue('date input', '12-12-2020')
            .editCheckboxValue('checkbox input', true)
            .editSelectValue('select input', 'key1')
            .editFileValue('file input', 'pizza.jpeg', 'image/jpeg')
            .clickSubmit()
            .verifyCanClickNext(true)
            .clickNext()

            // step 4
            .verifyInStep()
            .verifyCanClickNext(true)
            .verifyColumnText(0, 'column1', 'row1 column1')
            .verifyColumnText(0, 'column2', 'row1 column2')
            .verifyColumnText(0, 'column3', 'row1 column3')
            .verifyColumnText(1, 'column1', 'row2 column1')
            .verifyColumnText(1, 'column2', 'row2 column2')
            .verifyColumnText(1, 'column3', 'row2 column3')
            .verifyColumnText(2, 'column1', 'row3 column1')
            .verifyColumnText(2, 'column2', 'row3 column2')
            .verifyColumnText(2, 'column3', 'row3 column3')
            .clickNext()

            // step 5
            .verifyInStep()
            .verifyHasNotifications()
            .clickDone()

            // back to step1
            .verifyInStep()
        ;

        new JobsPage()
            .visit()
            .validateTitle()
            .verifyJobName(0, jobName)
        ;

    });
});