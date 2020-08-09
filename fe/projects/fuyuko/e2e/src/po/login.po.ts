import {browser, by, element, ElementFinder, promise, protractor, ProtractorExpectedConditions} from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get(`${browser.baseUrl}/login-layout/login`) as Promise<any>;
  }

  async isThisPage(): Promise<boolean> {
    const ec: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const p: boolean = await browser.wait(ec.urlContains('/login-layout/login'));
    return p;
  }

  async hasTitle(): Promise<boolean> {
    const e: ElementFinder = element(by.css('[test-page-title]'));
    const title: string =  await e.getAttribute('test-page-title');
    return (title === 'login');
  }

  async doLogin(username: string, password: string) {
    const u: ElementFinder = element(by.css('[test-field-username]'));
    const p: ElementFinder = element(by.css('[test-field-password]'));
    const b: ElementFinder = element(by.css('[test-button-login]'));
    await u.sendKeys(username);
    await p.sendKeys(password);
    await b.click();
  }
}
