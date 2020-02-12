import {ViewRulePage} from "./page-object/sub-page-object/view-rule.page";
import {LoginPage} from "./page-object/login.page";

describe('view-rule-custom', () => {

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
        viewRulePage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        viewRulePage
            .visit()
            .validateTitle();
    });

    it('should show and hide custom rules list', () => {
        viewRulePage
            .selectCustomTab()
            .clickShowCustomRulesList()
            .verifyCustomRuleListOpen(true)
            .clickHideCustomRulesList()
            .verifyCustomRuleListOpen(false)
        ;
    });

    it ('should add and remove custom rules', () => {
        // add 2 custom rules
        viewRulePage
            .selectCustomTab()
            .clickShowCustomRulesList()
            .verifyCustomRuleListOpen(true)
            .checkCustomRuleListCheckbox('0.0.1-sample-rule-1.js')
            .checkCustomRuleListCheckbox('0.0.2-sample-rule-2.js')
            .clickCustomRuleListUpdateButton()
            .verifySuccessMessageExists()
            .verifyCustomRuleExpantionPanelExists('0.0.1-sample-rule-1.js', true)
            .verifyCustomRuleExpantionPanelExists('0.0.2-sample-rule-2.js', true)
        ;

        // add only 1 custom rule
        viewRulePage
            .selectCustomTab()
            .clickShowCustomRulesList()
            .verifyCustomRuleListOpen(true)
            .checkCustomRuleListCheckbox('0.0.1-sample-rule-1.js')
            .uncheckCustomRuleListCheckbox('0.0.2-sample-rule-2.js')
            .clickCustomRuleListUpdateButton()
            .verifySuccessMessageExists()
            .verifyCustomRuleExpantionPanelExists('0.0.1-sample-rule-1.js', true)
            .verifyCustomRuleExpantionPanelExists('0.0.2-sample-rule-2.js', false)
        ;
    });

    it ('should allow enable and disable custom rules', () => {
        viewRulePage
            .selectCustomTab()
            .clickShowCustomRulesList()
            .verifyCustomRuleListOpen(true)
            .checkCustomRuleListCheckbox('0.0.1-sample-rule-1.js')
            .checkCustomRuleListCheckbox('0.0.2-sample-rule-2.js')
            .clickCustomRuleListUpdateButton()
            .verifySuccessMessageExists()
            .disableRule('0.0.1-sample-rule-1.js')
            .verifySuccessMessageExists()
            .verifyRuleEnabled('0.0.1-sample-rule-1.js', false)
            .disableRule('0.0.2-sample-rule-2.js')
            .verifySuccessMessageExists()
            .verifyRuleEnabled('0.0.2-sample-rule-2.js', false)
            .verifySuccessMessageExists()
            .enableRule('0.0.1-sample-rule-1.js')
            .verifySuccessMessageExists()
            .verifyRuleEnabled('0.0.1-sample-rule-1.js', true)
            .enableRule('0.0.2-sample-rule-2.js')
            .verifySuccessMessageExists()
            .verifyRuleEnabled('0.0.2-sample-rule-2.js', true)
    });

    it ('should allow delete of custom rules', () => {
        viewRulePage
            .selectCustomTab()
            .clickShowCustomRulesList()
            .verifyCustomRuleListOpen(true)
            .checkCustomRuleListCheckbox('0.0.1-sample-rule-1.js')
            .checkCustomRuleListCheckbox('0.0.2-sample-rule-2.js')
            .clickCustomRuleListUpdateButton()
            .verifySuccessMessageExists()
            .deleteRule('0.0.1-sample-rule-1.js')
            .verifySuccessMessageExists()
            .verifyRulePanelExists('0.0.1-sample-rule-1.js', false)
            .deleteRule('0.0.2-sample-rule-2.js')
            .verifySuccessMessageExists()
            .verifyRulePanelExists('0.0.2-sample-rule-2.js', false)
    });


});
