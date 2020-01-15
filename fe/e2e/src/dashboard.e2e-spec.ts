import {LoginPage} from "./po/login.po";
import {DashboardPage} from "./po/dashboard.po";
import {browser} from "protractor";

fdescribe('Dashboard', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    beforeEach(async () => {
        loginPage = new LoginPage();
        dashboardPage = new DashboardPage();

    });

    it('should display', async () => {
        await loginPage.navigateTo();
        await loginPage.doLogin('tmjee', 'test');
        await browser.refresh();
        dashboardPage.navigateTo();
        await browser.refresh();
        const isPage = await dashboardPage.isThisPage()
        const hasTitle = await dashboardPage.hasTitle();
        console.log('*******************', isPage, hasTitle);
        await dashboardPage.selectDashboardLayout();

        browser.sleep(10000);
    });
});
