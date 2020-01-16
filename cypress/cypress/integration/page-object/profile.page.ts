

export class ProfilePage {
    visit(): ProfilePage {
        cy.visit(`/gen-layout/(profile//help:profile-help)`);
        return this;
    }

    validateTitle(): ProfilePage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'profile');
        return this;
    }
}
