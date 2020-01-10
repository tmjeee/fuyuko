import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get(`${browser.baseUrl}/login-layout/login`) as Promise<any>;
  }

  async getTitleText(): Promise<string> {
    return await element(by.css('app-root app-login-page mat-card-title')).getText();
  }
}
