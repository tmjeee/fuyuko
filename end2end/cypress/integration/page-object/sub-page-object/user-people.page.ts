import {ActualPage} from "../actual.page";
import * as util from '../../util/util';

export class UserPeoplePage implements ActualPage<UserPeoplePage> {

    validateTitle(): UserPeoplePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-people');
        return this;
    }

    visit(): UserPeoplePage {
        cy.visit('/user-gen-layout/(people//help:user-help)');
        return this;
    }

    verifyErrorMessageExists(): UserPeoplePage {
        util.clickOnErrorMessageToasts(() => {});
        return this;
    }

    verifySuccessMessageExists(): UserPeoplePage {
        util.clickOnSuccessMessageToasts(() => {});
        return this;
    }

}
