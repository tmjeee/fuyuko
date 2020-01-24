import {AbstractPage} from "../abstract.page";
import {ActualPage} from "../actual.page";


export class ImportPage extends AbstractPage implements ActualPage<ImportPage> {

    visit(): ImportPage {
        cy.visit('/import-export-gen-layout/(import//help:import-help)');
        return this;
    }

    validateTitle(): ImportPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'import');
        return this;
    }

}
