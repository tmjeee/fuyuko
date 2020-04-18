import {DashboardPage} from "./page-object/dashboard.page";
import {LoginPage} from "./page-object/login.page";


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
        localStorage.clear();
        sessionStorage.clear();
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
        dashboardPage
            .visit()
            .validateTitle();
    });

    it ('should be able to switch dashboard strategies', () => {
        dashboardPage
            .visit()
            .changeDashboardStrategy('1x')
            .validateDashboardStrategyIs('1x')
            .changeDashboardStrategy('2x')
            .validateDashboardStrategyIs('2x');
    });


    it ('should be able to navigate to profile page', () => {
        dashboardPage
            .visit()
            .visitProfilePage()
            .validateTitle();
    });

    it ('should be able to navigate to dashboard page', () => {
        dashboardPage
            .visit()
            .visitDashboardPage()
            .validateTitle();
    });

    it ('should be able to navigate to user role page', () => {
        dashboardPage
            .visit()
            .visitUserPage()
            .visitUserRolePage()
            .validateTitle();
    });

    it('should be able to navigate to user group page', () => {
        dashboardPage
            .visit()
            .visitUserPage()
            .visitUserGroupPage()
            .validateTitle();
    });

    it ('should be able to navigate to user people page', () => {
        dashboardPage
            .visit()
            .visitUserPage()
            .visitUserPeoplePage()
            .validateTitle();
    });

    it ('should be able to navigate to user invitation page', () => {
        dashboardPage
            .visit()
            .visitUserPage()
            .visitUserInvitationPage()
            .validateTitle();
    });

    it ('should be able to navigate to user activation page', () => {
        dashboardPage
            .visit()
            .visitUserPage()
            .visitUserActivationPage()
            .validateTitle();
    });
});
