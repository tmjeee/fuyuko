import {DashboardPage} from "./page-object/dashboard.page";
import {LoginPage} from "./page-object/login.page";


describe('dashboard', () => {
    let dashboardPage: DashboardPage;
    before(() => {
        dashboardPage = new LoginPage()
            .visit()
            .validateTitle()
            .login('tmjee', 'test');
    });

    it ('should load', () => {
        dashboardPage
            .validateTitle();
    });

    it ('should be able to switch dashboard strategies', () => {
        dashboardPage
            .changeDashboardStrategy('1x')
            .validateDashboardStrategyIs('1x')
            .changeDashboardStrategy('2x')
            .validateDashboardStrategyIs('2x');
    });

    it ('should be able to navigate to profile page', () => {
        dashboardPage
            .visitProfilePage()
            .validateTitle();
    });

    it ('should be able to navigate to dashboard page', () => {
        dashboardPage
            .visitDashboardPage()
            .validateTitle();
    });

    it ('should be able to navigate to user page', () => {
    })
});
