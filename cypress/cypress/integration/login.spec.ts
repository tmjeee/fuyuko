import {LoginPage} from "./page-object/login.page";
import {DashboardPage} from "./page-object/dashboard.page";


describe('login', () => {

    it ('should load', () => {
        const loginPage = new LoginPage();
        loginPage.visit();
        loginPage.validateTitle();
        const dashboardPage: DashboardPage = loginPage.login('tmjee', 'test');
        dashboardPage.validateTitle();
    });
});
