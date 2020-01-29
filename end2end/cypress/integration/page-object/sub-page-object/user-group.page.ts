import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


export class UserGroupPage implements ActualPage<UserGroupPage> {

    validateTitle(): UserGroupPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-group');
        return this;
    }

    visit(): UserGroupPage {
        cy.visit('/user-gen-layout/(group//help:user-help)');
        return this;
    }

    verifyErrorMessageExists(): UserGroupPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): UserGroupPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
