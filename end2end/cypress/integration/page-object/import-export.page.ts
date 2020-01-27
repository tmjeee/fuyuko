import {ImportPage} from "./sub-page-object/import.page";
import {ExportPage} from "./sub-page-object/export.page";


export class ImportExportPage {

    visit(): ImportPage {
        cy.visit('/import-export-gen-layout/(import//help:import-help)');
        return new ImportPage();
    }

    visitImportPage(): ImportPage {
        cy.visit('/import-export-gen-layout/(import//help:import-help)');
        return new ImportPage();
    }

    visitExportPage(): ExportPage {
        cy.visit('/import-export-gen-layout/(export//help:import-help)');
        return new ExportPage();
    }
}
