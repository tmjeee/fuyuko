import * as util from "./util/util";
import {LoginPage} from "./page-object/login.page";
import {ViewRulePage} from "./page-object/sub-page-object/view-rule.page";

describe('view-rule', () => {

    let viewRulePage: ViewRulePage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewRulePage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewRule();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it ('should load', () => {
        viewRulePage
            .visit()
            .validateTitle();
    });

    it ('should toggle side nav', () => {
        util.toggleSideNav(() => {
            util.validateSideNavStateOpen(false);
        });
        util.toggleSideNav(() => {
            util.validateSideNavStateOpen(true);
        })
    });

    it ('should toggle help nav', () => {
        util.toggleHelpSideNav(() => {
            util.validateHelpNavStateOpen(true);
        });
        util.toggleHelpSideNav(() => {
            util.validateHelpNavStateOpen(false);
        });
    });

    it ('should toggle sub side nav', () => {
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(false);
        });
        util.toggleSubSideNav(() => {
            util.validateSubSideNavStateOpen(true);
        });
    });

    it ('should toggle rule expansion panel', () => {
        viewRulePage
            .togglePanel('Rule #1')
            .verifyPanelExpanded('Rule #1', true)
            .togglePanel('Rule #1')
            .verifyPanelExpanded('Rule #1', false)
            .togglePanel('Rule #2')
            .verifyPanelExpanded('Rule #2', true)
            .togglePanel('Rule #2')
            .verifyPanelExpanded('Rule #2', false)
            .togglePanel('Rule #3')
            .verifyPanelExpanded('Rule #3', true)
            .togglePanel('Rule #3')
            .verifyPanelExpanded('Rule #3', false)
            .togglePanel('Rule #4')
            .verifyPanelExpanded('Rule #4', true)
            .togglePanel('Rule #4')
            .verifyPanelExpanded('Rule #4', false)
            .togglePanel('Rule #5')
            .verifyPanelExpanded('Rule #5', true)
            .togglePanel('Rule #5')
            .verifyPanelExpanded('Rule #5', false)
            .togglePanel('Rule #6')
            .verifyPanelExpanded('Rule #6', true)
            .togglePanel('Rule #6')
            .verifyPanelExpanded('Rule #6', false)
        ;
    });

    it ('should be able to enable and disable rules', () => {
        viewRulePage
            .disableRule('Rule #1')
            .verifySuccessMessageExists()
            .verifyPanelRuleDisabled('Rule #1')
            .enableRule('Rule #1')
            .verifySuccessMessageExists()
            .verifyPanelRuleEnabled('Rule #1')
        ;

        viewRulePage
            .disableRule('Rule #2')
            .verifySuccessMessageExists()
            .verifyPanelRuleDisabled('Rule #2')
            .enableRule('Rule #2')
            .verifySuccessMessageExists()
            .verifyPanelRuleEnabled('Rule #2')
        ;


        viewRulePage
            .disableRule('Rule #3')
            .verifySuccessMessageExists()
            .verifyPanelRuleDisabled('Rule #3')
            .enableRule('Rule #3')
            .verifySuccessMessageExists()
            .verifyPanelRuleEnabled('Rule #3')
        ;


        viewRulePage
            .disableRule('Rule #4')
            .verifySuccessMessageExists()
            .verifyPanelRuleDisabled('Rule #4')
            .enableRule('Rule #4')
            .verifySuccessMessageExists()
            .verifyPanelRuleEnabled('Rule #4')
        ;

        viewRulePage
            .disableRule('Rule #5')
            .verifySuccessMessageExists()
            .verifyPanelRuleDisabled('Rule #5')
            .enableRule('Rule #5')
            .verifySuccessMessageExists()
            .verifyPanelRuleEnabled('Rule #5')
        ;

        viewRulePage
            .disableRule('Rule #6')
            .verifySuccessMessageExists()
            .verifyPanelRuleDisabled('Rule #6')
            .enableRule('Rule #6')
            .verifySuccessMessageExists()
            .verifyPanelRuleEnabled('Rule #6')
        ;
    });

    it ('should be editable', () => {
        viewRulePage
            .editRulePopup('Rule #1')

        ;
    });
});