import {ActualPage} from "./actual.page";
import {ProfilePage} from "./profile.page";
import {UserPage} from "./user.page";
import {ViewPage} from "./view.page";
import {PricingPage} from "./pricing.page";
import {BulkEditPage} from "./bulk-edit.page";
import {SettingsPage} from "./settings.page";
import {ImportExportPage} from "./import-export.page";
import {JobsPage} from "./jobs.page";
import {PartnerPage} from "./partner.page";
import * as util from '../util/util';


const PAGE_NAME = 'dashboard'
export class DashboardPage implements ActualPage<DashboardPage> {

    visit(): DashboardPage {
        cy.visit('/dashboard-layout/(dashboard//help:dashboard-help)');
        this.waitForReady();
        return this;
    }

    waitForReady(): DashboardPage {
        util.waitUntilTestPageReady(PAGE_NAME);
        return this;
    }

    validateTitle(): DashboardPage {
       cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', PAGE_NAME);
       return this;
    }

    changeDashboardStrategy(dashboardStrategyId: string): DashboardPage {
        cy.get(`[test-mat-select]`)
            .click({force: true});
        cy.get(`[test-mat-option='${dashboardStrategyId}']`)
            .focus()
            .click({force: true});
        return this;
    }

    validateDashboardStrategyIs(dashboardStrategyId: string): DashboardPage {
        cy.get(`[test-dashboard-strategy]`).should('have.attr', 'test-dashboard-strategy', dashboardStrategyId);
        return this;
    }


    visitProfilePage() {
        // cy.get(`[test-sidenav='profile']`).click({force: true});
        return new ProfilePage().visit();
    }

    visitDashboardPage() {
        // cy.get(`[test-sidenav='dashboard']`).click({force: true});
        return new DashboardPage().visit();
    }

    visitUserPage() {
        // cy.get(`[test-sidenav='user']`).click({force: true});
        return new UserPage().visit();
    }

    visitViewPage(): ViewPage {
        // cy.get(`[test-sidenav='view']`).click({force: true});
        // cy.wait(1000);
        return new ViewPage().visit();
    }

    visitPricingPage(): PricingPage {
        // cy.get(`[test-sidenav='pricing']`).click({force: true});
        return new PricingPage().visit();
    }

    visitBulkEditPage(): BulkEditPage {
        // cy.get(`[test-sidenav='bulk-edit']`).click({force: true});
        return new BulkEditPage().visit();
    }

    visitSettingsPage(): SettingsPage {
        // cy.get(`[test-sidenav='settings']`).click({force: true});
        return new SettingsPage().visit();
    }

    visitImportExportPage(): ImportExportPage {
        // cy.get(`[test-sidenav='import-export']`).click({force: true});
        return new ImportExportPage().visit();
    }

    visitJobsPage() {
        // cy.get(`[test-sidenav='jobs']`).click({force: true});
        return new JobsPage().visit();
    }

    visitPartnerPage() {
        // cy.get(`[test-sidenav='partner']`).click({force: true});
        return new PartnerPage().visit();
    }

    verifyErrorMessageExists(): DashboardPage {
        util.clickOnErrorMessageToasts();
        return this;
    }

    verifySuccessMessageExists(): DashboardPage {
        util.clickOnSuccessMessageToasts();
        return this;
    }

    /*
    logout() {
        cy.get(`[test-sidenav='exit']`).click();
        return new LoginPage();
    }
     */

}
