import {AbstractPage} from "../abstract.page";
import {ActualPage} from "../actual.page";


export class ExportPage extends AbstractPage implements ActualPage<ExportPage> {

    visit(): ExportPage {
        cy.visit('/import-export-gen-layout/(export//help:import-help)');
        return this;
    }

    validateTitle(): ExportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'export');
        return this;
    }


}
