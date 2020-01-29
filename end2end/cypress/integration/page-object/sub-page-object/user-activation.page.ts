import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class UserActivationPage implements ActualPage<UserActivationPage> {

    validateTitle(): UserActivationPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-activation');
        return this;
    }

    visit(): UserActivationPage {
        cy.visit('/user-gen-layout/(activation//help:user-help)');
        return this;
    }

    verifyErrorMessageExists(): UserActivationPage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): UserActivationPage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
