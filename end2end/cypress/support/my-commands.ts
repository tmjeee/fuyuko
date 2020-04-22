
const LOCAL_STORAGE_MEMORY = {};

declare namespace Cypress {
    interface Chainable<Subject> {
        saveLocalStorage: typeof SaveLocalStorage,
        restoreLocalStorage: typeof RestoreLocalStorage,
    }
}

function SaveLocalStorage(): Cypress.Chainable<JQuery> {
    Object.keys(localStorage).forEach((key) => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
    return cy as any;
}

function RestoreLocalStorage(): Cypress.Chainable<JQuery> {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
    return cy as any;
}


Cypress.Commands.add('saveLocalStorage', SaveLocalStorage);
Cypress.Commands.add('restoreLocalStorage', RestoreLocalStorage);

import 'cypress-wait-until';