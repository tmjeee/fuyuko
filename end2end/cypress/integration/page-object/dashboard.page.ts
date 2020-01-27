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


export class DashboardPage implements ActualPage<DashboardPage> {

    visit(): DashboardPage {
        cy.visit('/dashboard-layout/(dashboard//help:dashboard-help)');
        return this;
    }

    validateTitle(): DashboardPage {
       cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'dashboard');
       return this;
    }

    changeDashboardStrategy(dashboardStrategyId: string): DashboardPage {
        cy.get(`[test-mat-select]`)
            .click();
        cy.get(`[test-mat-option='${dashboardStrategyId}']`)
            .focus()
            .click();
        return this;
    }

    validateDashboardStrategyIs(dashboardStrategyId: string): DashboardPage {
        cy.get(`[test-dashboard-strategy]`).should('have.attr', 'test-dashboard-strategy', dashboardStrategyId);
        return this;
    }


    visitProfilePage() {
        cy.get(`[test-sidenav='profile']`).click();
        return new ProfilePage();
    }

    visitDashboardPage() {
        cy.get(`[test-sidenav='dashboard']`).click();
        return new DashboardPage();
    }

    visitUserPage() {
        cy.get(`[test-sidenav='user']`).click();
        return new UserPage();
    }

    visitViewPage() {
        cy.get(`[test-sidenav='view']`).click();
        return new ViewPage();
    }

    visitPricingPage() {
        cy.get(`[test-sidenav='pricing']`).click();
        return new PricingPage();
    }

    visitBulkEditPage() {
        cy.get(`[test-sidenav='bulk-edit']`).click();
        return new BulkEditPage();
    }

    visitSettingsPage() {
        cy.get(`[test-sidenav='settings']`).click();
        return new SettingsPage();
    }

    visitImportExportPage() {
        cy.get(`[test-sidenav='import-export']`).click();
        return new ImportExportPage();
    }

    visitJobsPage() {
        cy.get(`[test-sidenav='jobs']`).click();
        return new JobsPage();
    }

    visitPartnerPage() {
        cy.get(`[test-sidenav]='partner']`).click();
        return new PartnerPage();
    }

    /*
    logout() {
        cy.get(`[test-sidenav='exit']`).click();
        return new LoginPage();
    }
     */

}
