import {ImportPage} from "./sub-page-object/import.page";
import {ExportPage} from "./sub-page-object/export.page";
import {ExportArtifactsPage} from "./sub-page-object/export-artifacts.page";


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

    visitExportArtifactsPage(): ExportArtifactsPage {
        cy.visit(`/import-export-gen-layout/export-artifacts//help:import-help`);
        return new ExportArtifactsPage();
    }
}
