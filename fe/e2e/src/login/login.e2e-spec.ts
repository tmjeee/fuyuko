import { LoginPage } from './login.po';
import {assertNoErrorsInBrowserLogs} from '../assertion.utils';

describe('Login', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should display', async () => {
    page.navigateTo();
    expect((await page.getTitleText()).trim()).toEqual('Login');
  });

  afterEach(async () => {
      await assertNoErrorsInBrowserLogs();
  });
});
