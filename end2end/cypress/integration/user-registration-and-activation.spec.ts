import {UserRolesPage} from "./page-object/sub-page-object/user-roles.page";
import {LoginPage} from "./page-object/login.page";
import {UserActivationPage} from "./page-object/sub-page-object/user-activation.page";
import * as util from "./util/util";
import {RegisterPage} from "./page-object/register.page";

describe("user-role", () => {

    let userActivationPage: UserActivationPage;
    let registerPage: RegisterPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        registerPage = new RegisterPage();
        userActivationPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitUserPage()
            .visitUserActivationPage();
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
        userActivationPage
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


    it ('should register (in register page)', () => {
        const r = Math.random();
        const email = `test-${r}@test.com`;
        const username = `username-${r}`;
        const firstname = `firstname-${r}`;
        const lastname = `lastname-${r}`;
        const password = `test`;
        registerPage
            .visit()
            .fillIn('', '', '', '', '', '')
            .verifyFormSubmittable(false)
            .fillIn(email, '', '', '', '', '')
            .verifyFormSubmittable(false)
            .fillIn(email, username, '', '', '', '')
            .verifyFormSubmittable(false)
            .fillIn(email, username, firstname, '', '', '')
            .verifyFormSubmittable(false)
            .fillIn(email, username, firstname, lastname, '', '')
            .verifyFormSubmittable(false)
            .fillIn(email, username, firstname, lastname, password, '')
            .verifyFormSubmittable(false)
            .fillIn(email, username, firstname, lastname, password, 'asd')
            .verifyFormSubmittable(false)
            .fillIn(email, username, firstname, lastname, '', password)
            .verifyFormSubmittable(false)
            .fillIn(email, username, lastname, lastname, 'asd', password)
            .verifyFormSubmittable(false)
            .fillIn(email, username, firstname, lastname, password, password)
            .verifyFormSubmittable(true)
        ;
    });


    it ('should be able to do search in activation page', () => {
        userActivationPage
            .search('self3')
            .verifyActivationEntriesSizeInTable(10)
            .search('self4')
            .verifyActivationEntriesSizeInTable(10)
        ;
    });

    it ('should be able to do activation of an activation registration', () => {
        const r = Math.random();
        const email = `cypress-registration-${r}@test.com`;
        const username = `username-${r}`;
        const firstname = `firstname-${r}`;
        const lastname = `lastname-${r}`;
        const password = `test`;

        registerPage
            .visit()
            .fillIn(email, username, firstname, lastname, password, password)
            .verifyFormSubmittable(true)
            .submitRegistration()
            .verifySuccessMessageExists()
        ;

        userActivationPage
            .visit()
            .search('cypress-registration-')
            .verifyActivationEntriesSizeInTable(1)
            .activateUser(username)
            .verifySuccessMessageExists()
            .verifyActivationEntriesSizeInTable(0);
    });


    it ('should be able to do deletion of an activation registration', () => {
        const r = Math.random();
        const email = `cypress-registration-${r}@test.com`;
        const username = `username-${r}`;
        const firstname = `firstname-${r}`;
        const lastname = `lastname-${r}`;
        const password = `test`;

        registerPage
            .visit()
            .fillIn(email, username, firstname, lastname, password, password)
            .verifyFormSubmittable(true)
            .submitRegistration()
            .verifySuccessMessageExists()
        ;

        userActivationPage
            .visit()
            .search('cypress-registration-')
            .verifyActivationEntriesSizeInTable(1)
            .deleteUser(username)
            .verifySuccessMessageExists()
            .verifyActivationEntriesSizeInTable(0);
    });

});
