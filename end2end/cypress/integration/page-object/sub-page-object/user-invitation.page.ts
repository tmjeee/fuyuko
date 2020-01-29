import {ActualPage} from "../actual.page";
import * as util from '../../util/util';


export class UserInvitationPage implements ActualPage<UserInvitationPage> {

    validateTitle(): UserInvitationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-invitation');
        return this;
    }

    visit(): UserInvitationPage {
        cy.visit('/user-gen-layout/(invitation//help:user-help)');
        return this;
    }

    verifyErrorMessageExists(): UserInvitationPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): UserInvitationPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }
}
