

export const getMyself = (): any => {
    const s: string = (localStorage.getItem('MY_APP_MYSELF'));
    if (s) {
        return JSON.parse(s);
    }
    return {};
}

export const clearAllMessageToasts = () => {
    cy.get('simple-notifications')
        .find('.simple-notification')
        .each(($el: any, index: number, $list: any[]) => {
            cy.wrap($el).click({force: true});
        });
}


export const clickOnSuccessMessageToasts = (callbackFn: Function) => {
    cy.get('simple-notifications').then((_) => {
      const l = _.find(`.simple-notification.success`).length;
      cy.wrap(new Array(l)).each((e, i, a) => {
          cy.get('simple-notifications')
              .find(`.simple-notification.success`)
              .each((e, i, a) => {
                cy.wrap(e).click({force: true});
              });
          if (i === a.length) { // last
              callbackFn && callbackFn();
          }
      });
    });
    /*
    cy.get('simple-notifications')
        .find('.simple-notification.success').each((n, index, list) => {
        cy.wrap(n).click({force: true});
        if (index === (list.length -1)) { // last one
            callbackFn && callbackFn();
        }
    });
     */
}

export const clickOnErrorMessageToasts = (callbackFn: Function) => {
    cy.get('simple-notifications').then((_) => {
        const l = _.find(`.simple-notification.error`).length;
        cy.wrap(new Array(l)).each((e, i, a) => {
            cy.get('simple-notifications')
                .find(`.simple-notification.error`)
                .each((e, i, a) => {
                    cy.wrap(e).click({force: true});
                });
            if (i === a.length) { // last
                callbackFn && callbackFn();
            }
        });
    });
    /*
    cy.get('simple-notifications').find('.simple-notification.error').then((n) => {
        cy.wrap(n).click({force: true});
        callbackFn && callbackFn();
    });
     */
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

