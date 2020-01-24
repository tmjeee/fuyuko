import {AbstractPage} from "./abstract.page";
import {UserRolesPage} from "./sub-page-object/user-roles.page";
import {UserGroupPage} from "./sub-page-object/user-group.page";
import {UserPeoplePage} from "./sub-page-object/user-people.page";
import {UserInvitationPage} from "./sub-page-object/user-invitation.page";
import {UserActivationPage} from "./sub-page-object/user-activation.page";


export class UserPage extends AbstractPage {


    visit(): UserPage {
        cy.visit(`/user-gen-layout/(role//help:user-help)`);
        return this;
    }

    visitUserRole(): UserRolesPage {
        cy.visit(`/user-gen-layout/(role//help:user-help)`);
        return new UserRolesPage();
    }

    visitUserGroup(): UserGroupPage {
        cy.visit(`/user-gen-layout/(group//help:user-help)`);
        return new UserGroupPage();
    }

    visitUserPeople(): UserPeoplePage {
        cy.visit(`/user-gen-layout/(people//help:user-help)`);
        return new UserPeoplePage();
    }

    visitUserInvitation() {
        cy.visit(`/user-gen-layout/(invitation//help:user-help)`);
        return new UserInvitationPage();
    }

    visitUserActivation() {
        cy.visit(`/user-gen-layout/(activation//help:user-help)`);
        return new UserActivationPage();
    }
}
