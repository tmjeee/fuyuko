import {browser, by, element, ElementFinder, protractor, ProtractorExpectedConditions} from 'protractor';


export class DashboardPage {

    navigateTo() {
        return browser.get(`${browser.baseUrl}/dashboard-layout/(dashboard//help:dashboard-help)`) as Promise<any>;
    }

    async hasTitle() {
        const e: ElementFinder = element(by.css('[test-page-title]'));
        const title: string =  await e.getAttribute('test-page-title');
        return (title === 'dashboard');
    }


    async isThisPage() {
        const ec: ProtractorExpectedConditions = protractor.ExpectedConditions;
        const p1: boolean = await browser.wait(ec.urlContains('/dashboard-layout'));
        const p2: boolean = await browser.wait(ec.urlContains('dashboard'));
        const p3: boolean = await browser.wait(ec.urlContains('dashboard-help'));
        return (p1 && p2 && p3);
    }

    async selectDashboardLayout() {
        await element(by.css('[test-mat-select]')).click();
        await element(by.css('[test-mat-option="1x"]')).click();
    }
}
