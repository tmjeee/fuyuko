import {ActualPage} from "../actual.page";
import * as util from "../../util/util";

export class ViewDataThumbnailPage implements ActualPage<ViewDataThumbnailPage> {

    validateTitle(): ViewDataThumbnailPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-thumbnail');
        return this;
    }

    visit(): ViewDataThumbnailPage {
        cy.visit(`/view-gen-layout/(data-thumbnail//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataThumbnailPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataThumbnailPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

    search(search: string): ViewDataThumbnailPage {
        cy.get(`[test-field-data-table-search]`)
            .clear({force: true})
            .type(`${search}{enter}`, {force: true});
        return this;
    }
}
