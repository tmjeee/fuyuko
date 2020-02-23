import {ActualPage} from "../actual.page";
import * as util from "../../util/util";
import {ViewDataListEditPopupPage} from "./sub-sub-page-object/view-data-list-edit-popup.page";

export class ViewDataListPage implements ActualPage<ViewDataListPage> {

    validateTitle(): ViewDataListPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'view-data-list');
        return this;
    }

    visit(): ViewDataListPage {
        cy.visit(`/view-gen-layout/(data-list//help:view-help)`);
        return this;
    }

    verifyErrorMessageExists(): ViewDataListPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): ViewDataListPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }


    clickAdd(): ViewDataListEditPopupPage {
        return new ViewDataListEditPopupPage();
    }

    clickReload(): ViewDataListPage {
        return this;
    }

    clickDelete(itemNames: string[]): ViewDataListPage {
        return this;
    }
}
