import {LoginPage} from "../page-object/login.page";
import {DashboardPage} from "../page-object/dashboard.page";


describe('login', () => {

    it ('should load', () => {
        const loginPage = new LoginPage()
            .visit()
            .validateTitle();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        const dashboardPage: DashboardPage = loginPage.login(username, password);
        dashboardPage.validateTitle();
    });
});
