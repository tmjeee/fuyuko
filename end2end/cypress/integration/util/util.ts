import {ViewViewPage} from "../page-object/sub-page-object/view-view.page";
import {ViewPage} from "../page-object/view.page";


export const getMyself = (): any => {
    const s: string = (localStorage.getItem('MY_APP_MYSELF'));
    if (s) {
        return JSON.parse(s);
    }
    return {};
}

export const waitUntilTestPageReady = (pageName: string) => {
    cy.waitUntil(() => {
        return cy.get(`[test-page-ready]`)
            .then((n) => {
                return ((n.attr('test-page-ready') == 'true') &&
                        (n.attr('test-page-title') == pageName));
            })
    }, {
        timeout: 100000,
        interval: 1000,
    });
};

export const clearAllMessageToasts = () => {
    cy.waitUntil(() => cy.get('simple-notifications .simple-notification')).each((n, index, list) => {
        Cypress.dom.isAttached(n) && cy.wrap(n).click({force: true});
    });
}



export const clickOnSuccessMessageToasts = () => {
    /*
    cy.get('simple-notifications .simple-notification.success').each((n, index, list) => {
        Cypress.dom.isAttached(n) && cy.wrap(n).click({force: true});
    });
     */
    // cy.waitUntil(() => cy.get('simple-notifications .simple-notification.success')).first().click({force: true});
    cy.waitUntil(() => {
        return cy.get('simple-notifications .simple-notification.success').then((_) => {
            return (_.length > 0)
        })
    });
    cy.get("body").then($body => {
        if ($body.find("simple-notifications .simple-notification.success").length > 0) {   //evaluates as true
            // cy.get("simple-notifications .simple-notification.success").click();
            cy.get('simple-notifications .simple-notification.success').first().click({force: true});
        }
    });
}

export const clickOnErrorMessageToasts = () => {
    /*
    cy.waitUntil(() => cy.get(`simple-notifications .simple-notification.error`)).each((n, index, list) => {
        Cypress.dom.isAttached(n) && cy.wrap(n).click({force: true});
    });
     */
    cy.waitUntil(() => cy.get('simple-notifications .simple-notification.error')).first().click({force: true});
}

export const toggleSideNav = (fn: Function) => {
    cy.waitUntil(() => cy.get('[test-side-nav-toggle-icon]')).click({force: true}).then((_) => {
        cy.waitUntil(() => cy.get(`[test-side-nav-state-open]`)).then((__) => {
            fn && fn();
        });
    });
}

export function toggleSubSideNav(fn: () => void) {
    cy.waitUntil(() => cy.get(`[test-sub-side-nav-toggle-icon`)).click({force: true}).then((_) => {
       cy.waitUntil(() => cy.get(`[test-sub-side-nav-state-open]`)).then((__) => {
           fn && fn();
       })
    });
}

export const toggleHelpSideNav = (fn: Function) => {
    cy.waitUntil(() => cy.get('[test-help-nav-toggle-icon]')).click({force: true}).then((n) => {
        cy.waitUntil(() => cy.get(`[test-help-nav-state-open]`)).then((__) => {
            fn && fn();
        })
    });
}

export function validateSideNavStateOpen(b: boolean) {
    cy.waitUntil(() => cy.get(`[test-side-nav-state-open]`)).should('have.attr', 'test-side-nav-state-open', `${b}`);
}

export function validateHelpNavStateOpen(b: boolean) {
    cy.waitUntil(() => cy.get(`[test-help-nav-state-open]`)).should('have.attr', 'test-help-nav-state-open', `${b}`);
}

export function validateSubSideNavStateOpen(b: boolean) {
    cy.waitUntil(() => cy.get(`[test-sub-side-nav-state-open]`)).should('have.attr', 'test-sub-side-nav-state-open', `${b}`);
}

export const createNewView = (): string => {
    const r = Math.random();
    const viewName = `New-View-${r}`;
    const viewDescription = `New-View-Description-${r}`;
    const viewViewPage: ViewViewPage = new ViewPage()
        .visitViews()
        .validateTitle()
        .clickAdd()
        .editName(viewName)
        .editDescription(viewDescription)
        .clickOk()
        .clickSave()
        .verifySuccessMessageExists()
    ;
    return viewName;
};

export const deleteView = (viewName: string) => {
    new ViewPage()
        .visitViews()
        .clickDelete([viewName])
        .clickSave()
        .verifySuccessMessageExists();
};

