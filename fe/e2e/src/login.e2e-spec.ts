import { LoginPage } from './po/login.po';
import {assertNoErrorsInBrowserLogs} from './assertion.utils';
import {browser, protractor, ProtractorExpectedConditions} from 'protractor';
import {DashboardPage} from './po/dashboard.po';

describe('Login', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    dashboardPage = new DashboardPage();
  });

  it('should display', async () => {
    await loginPage.navigateTo();
    const hasTitle: boolean = await loginPage.hasTitle();
    const isLoginPage: boolean = await loginPage.isThisPage();

    expect(hasTitle).toBe(true);
    expect(isLoginPage).toBe(true);
  });

  it('should login', async () => {
    await loginPage.navigateTo();
    await loginPage.doLogin('tmjee', 'test');

    const isDashboardPage: boolean = await dashboardPage.isThisPage();
  });

  afterEach(async () => {
      await assertNoErrorsInBrowserLogs();
  });
});
