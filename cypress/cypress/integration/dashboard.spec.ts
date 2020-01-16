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
            .validateTitle()
            .changeDashboardStrategy('1x')
            .validateDashboardStrategyIs('1x')
            .changeDashboardStrategy('2x')
            .validateDashboardStrategyIs('2x');
    });
});
