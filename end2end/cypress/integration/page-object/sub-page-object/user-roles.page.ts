import {ActualPage} from "../actual.page";


export class UserRolesPage implements ActualPage<UserRolesPage> {

    validateTitle(): UserRolesPage {
        cy.get(`[test-page-title]`).should('have.attr', 'test-page-title', 'user-role');
        return this;
    }

    visit(): UserRolesPage {
        cy.visit('/user-gen-layout/(role//help:user-help)');
        return this;
    }

    toggleRole(roleName: string): UserRolesPage {
       cy.get(`[test-expansion-panel-header='${roleName}']`).click({force: true});
       return this;
    }


    verifyRolePanelExpanded(roleName: string, b: boolean): UserRolesPage {
        cy.get(`[test-expansion-panel-content='${roleName}']`)
            .should('not.be.disabled');
        return this;
    }

    searchRole(roleName: string, search: string, autoCompleteGroupName: string) {
        cy.get(`[test-expansion-panel-content='${roleName}']`)
            .find(`[test-field-search]`).clear().type(search);
        cy.get(`[test-expansion-panel-content='${roleName}'`)
            .find(`[test-auto-complete-option='${autoCompleteGroupName}']`);

        return this;
    }
}
