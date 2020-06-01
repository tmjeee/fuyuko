import {DashboardPage} from "../page-object/dashboard.page";
import {LoginPage} from "../page-object/login.page";


describe('dashboard', () => {
    let dashboardPage: DashboardPage;
    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // dashboardPage = new LoginPage()
        //     .visit()
        //     .login(username, password);
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });

    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        dashboardPage = new LoginPage()
            .visit()
            .login(username, password);
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it ('should load', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .validateTitle();
    });

    it ('should be able to switch dashboard strategies', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .changeDashboardStrategy('1x')
            .validateDashboardStrategyIs('1x')
            .changeDashboardStrategy('2x')
            .validateDashboardStrategyIs('2x');
    });


    it ('should be able to navigate to profile page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitProfilePage()
            .validateTitle();
    });

    it ('should be able to navigate to dashboard page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitDashboardPage()
            .validateTitle();
    });

    it ('should be able to navigate to user role page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitUserPage()
            .visitUserRolePage()
            .validateTitle();
    });

    it('should be able to navigate to user group page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitUserPage()
            .visitUserGroupPage()
            .validateTitle();
    });

    it ('should be able to navigate to user people page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitUserPage()
            .visitUserPeoplePage()
            .validateTitle();
    });

    it ('should be able to navigate to user invitation page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitUserPage()
            .visitUserInvitationPage()
            .validateTitle();
    });

    it ('should be able to navigate to user activation page', () => {
        Cypress.currentTest.retries(1);
        dashboardPage
            .visitUserPage()
            .visitUserActivationPage()
            .validateTitle();
    });
});
