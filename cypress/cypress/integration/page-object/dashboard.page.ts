import {AbstractPage} from "./abstract.page";
import {ActualPage} from "./actual.page";


export class DashboardPage extends AbstractPage implements ActualPage<DashboardPage> {

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
            .click()
            .find(`[test-mat-option]='${dashboardStrategyId}'`)
            .click();
        return this;
    }

    validateDashboardStrategyIs(dashboardStrategyId: string): DashboardPage {
        cy.get(`[test-dasboard-strategy]`).should('have.attr', 'test-dashboard-strategy', dashboardStrategyId);
        return this;
    }

}
