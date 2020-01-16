

export class UserPage {


    visit(): UserPage {
        cy.visit(`/user-gen-layout`);
        return this;
    }

    visitUserRole() {
        cy.visit(`/user-gen-layout/(role//help:user-help)`);
        return this;
    }

    visitUserGroup() {
        cy.visit(`/user-gen-layout/(group//help:user-help)`);
        return this;
    }

    visitUserPeople() {
        cy.visit(`/user-gen-layout/(people//help:user-help)`);
        return this;
    }

    visitUserInvitation() {
        cy.visit(`/user-gen-layout/(invitation//help:user-help)`);
        return this;
    }

    visitUserActivation() {
        cy.visit(`/user-gen-layout/(activation//help:user-help)`);
        return this;
    }
}
