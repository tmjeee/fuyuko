import {UserRolesPage} from "./sub-page-object/user-roles.page";
import {UserGroupPage} from "./sub-page-object/user-group.page";
import {UserPeoplePage} from "./sub-page-object/user-people.page";
import {UserInvitationPage} from "./sub-page-object/user-invitation.page";
import {UserActivationPage} from "./sub-page-object/user-activation.page";


export class UserPage {


    visit(): UserPage {
        // cy.visit(`/user-gen-layout/(role//help:user-help)`);
        new UserRolesPage().visit();
        return this;
    }

    visitUserRolePage(): UserRolesPage {
        // cy.visit(`/user-gen-layout/(role//help:user-help)`);
        return new UserRolesPage().visit();
    }

    visitUserGroupPage(): UserGroupPage {
        // cy.visit(`/user-gen-layout/(group//help:user-help)`);
        return new UserGroupPage().visit();
    }

    visitUserPeoplePage(): UserPeoplePage {
        // cy.visit(`/user-gen-layout/(people//help:user-help)`);
        return new UserPeoplePage().visit();
    }

    visitUserInvitationPage() {
        // cy.visit(`/user-gen-layout/(invitation//help:user-help)`);
        return new UserInvitationPage().visit();
    }

    visitUserActivationPage() {
        // cy.visit(`/user-gen-layout/(activation//help:user-help)`);
        return new UserActivationPage().visit();
    }
}
