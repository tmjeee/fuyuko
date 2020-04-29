import {LoginPage} from "../page-object/login.page";
import {ViewValidationPage} from "../page-object/sub-page-object/view-validation.page";


describe(`view validation spec`, () => {

    let viewValidationPage: ViewValidationPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // viewValidationPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitViewPage()
        //     .visitValidations();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewValidationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitValidations();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        viewValidationPage
            .validateTitle()
        ;
    });

    //////////////////

    it(`should run validation and show details and delete validation`, () => {

        const validationName = `test-validation-${Math.random()}`;
        const validationDescription = `test-validation-description-${Math.random()}`;

       viewValidationPage
            .clickRunValidation()
             .verifyPopupTitle()
            .editName(validationName)
            .editDescription(validationDescription)
             .clickOk()
            .verifySuccessMessageExists()
       ;

       cy.wait(1000); // wait for validation to be done

        // try expand and collapse
        viewValidationPage
             .clickReload()
             .expandValidationPanel(validationName)
             .verifyValidationPanelExpanded(validationName)
             .collapseValidationPanel(validationName)
             .verifyValidationPanelCollapsed(validationName)
            .expandValidationPanel(validationName)
            .verifyValidationPanelExpanded(validationName)
            .clickDelete(validationName)
            .verifySuccessMessageExists()
        ;
    });

});
