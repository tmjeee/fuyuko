import {ViewViewPage} from "../page-object/sub-page-object/view-view.page";
import {ViewPage} from "../page-object/view.page";


export const getMyself = (): any => {
    const s: string = (localStorage.getItem('MY_APP_MYSELF'));
    if (s) {
        return JSON.parse(s);
    }
    return {};
}

export const clearAllMessageToasts = () => {
    cy.wait(100).get('simple-notifications')
        .find('.simple-notification')
        .each(($el: any, index: number, $list: any[]) => {
            cy.wrap($el).click({force: true});
        }).wait(100);
}


export const clickOnSuccessMessageToasts = (callbackFn?: Function) => {
    cy.wait(100).get('simple-notifications')
        .find('.simple-notification.success').each((n, index, list) => {
        cy.wrap(n).click({force: true});
        if (index === (list.length -1)) { // last one
            callbackFn && callbackFn();
        }
    }).wait(100);
}

export const clickOnErrorMessageToasts = (callbackFn?: Function) => {
    cy.wait(100).get('simple-notifications')
        .find('.simple-notification.error').each((n, index, list) => {
        cy.wrap(n).click({force: true});
        if (index === (list.length -1)) { // last one
            callbackFn && callbackFn();
        }
    }).wait(100);
}

export const toggleSideNav = (fn: Function) => {
    cy.get('[test-side-nav-toggle-icon]').click({force: true});
    fn && fn();
}

export function toggleSubSideNav(fn: () => void) {
    cy.get(`[test-sub-side-nav-toggle-icon`).click({force: true});
    fn && fn();
}

export const toggleHelpSideNav = (fn: Function) => {
    cy.get('[test-help-nav-toggle-icon]').click({force: true}).then((n) => {
        fn && fn();
    });
}

export function validateSideNavStateOpen(b: boolean) {
    cy.get(`[test-side-nav-state-open]`).then((n) => {
        expect(n).to.have.attr('test-side-nav-state-open', `${b}`)
    });
}

export function validateHelpNavStateOpen(b: boolean) {
    cy.get(`[test-help-nav-state-open]`).then((n) => {
        expect(n).to.have.attr('test-help-nav-state-open', `${b}`)
    });
}

export function validateSubSideNavStateOpen(b: boolean) {
    cy.get(`[test-sub-side-nav-state-open]`).then((n) => {
        expect(n).to.have.attr('test-sub-side-nav-state-open', `${b}`);
    });
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
    ;

    cy.wait(100).then((_) => {
        viewViewPage.verifySuccessMessageExists();
    });

    return viewName;
};

export const deleteView = (viewName: string) => {
    new ViewPage()
        .visitViews()
        .clickDelete([viewName])
        .clickSave()
        .verifySuccessMessageExists();
};

