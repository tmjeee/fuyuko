import {ViewDataListPage} from "./page-object/sub-page-object/view-data-list.page";
import {LoginPage} from "./page-object/login.page";
import {ViewViewPage} from "./page-object/sub-page-object/view-view.page";


describe(`view view spec`, () => {


    let viewViewPage: ViewViewPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // viewViewPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitViewPage()
        //     .visitViews();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewViewPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViews();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        viewViewPage
            .validateTitle()
        ;
    });

    //////////////////

    it('should add and delete view', () => {
        const viewName = `New-View-${Math.random()}`;
        const viewDescription = `New-View-Description-${Math.random()}`;

        viewViewPage
            .clickAdd()
            .editName(viewName)
            .editDescription(viewDescription)
            .clickOk()
            .clickSave()
            .verifySuccessMessageExists()
            .verifyViewExits(viewName)
            .verifyViewDescription(viewName, viewDescription)
            .clickDelete([viewName])
            .clickSave()
            .verifySuccessMessageExists()
        ;
    });

    it(`should reload`, () => {
        const viewName = `New-View-${Math.random()}`;
        const viewDescription = `New-View-Description-${Math.random()}`;

        viewViewPage
            .clickAdd()
            .editName(viewName)
            .editDescription(viewDescription)
            .clickOk()
            .verifyViewExits(viewName)
            .clickReload()
            .verifyViewDontExits(viewName)
        ;
    });
});
