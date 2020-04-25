import {ImportPage} from "./sub-page-object/import.page";
import {ExportPage} from "./sub-page-object/export.page";
import {ExportArtifactsPage} from "./sub-page-object/export-artifacts.page";
import {CustomImportPage} from "./sub-page-object/custom-import.page";
import {CustomExportPage} from "./sub-page-object/custom-export.page";


export class ImportExportPage {

    visit(): ImportExportPage {
        // cy.visit('/import-export-gen-layout/(import//help:import-help)');
        new ImportPage().visit();
        return this;
    }

    visitImportPage(): ImportPage {
        // cy.visit('/import-export-gen-layout/(import//help:import-help)');
        // cy.wait(1000);
        return new ImportPage().visit();
    }

    visitExportPage(): ExportPage {
        // cy.visit('/import-export-gen-layout/(export//help:import-help)');
        return new ExportPage().visit();
    }

    visitExportArtifactsPage(): ExportArtifactsPage {
        // cy.visit(`/import-export-gen-layout/export-artifacts//help:import-help`);
        return new ExportArtifactsPage().visit();
    }

    visitCustomImportPage(): CustomImportPage {
        // cy.visit(`/import-export-gen-layout/(custom-import//help:import-help)`);
        return new CustomImportPage().visit();
    }

    visitCustomExportPage(): CustomExportPage {
        // cy.visit(`/import-export-gen-layout/(custom-export//help:export-help)`);
        return new CustomExportPage().visit();
    }
}
