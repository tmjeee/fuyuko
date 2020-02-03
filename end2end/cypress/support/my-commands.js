const LOCAL_STORAGE_MEMORY = {};
function SaveLocalStorage() {
    Object.keys(localStorage).forEach((key) => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
    return cy;
}
function RestoreLocalStorage() {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
    return cy;
}
Cypress.Commands.add('saveLocalStorage', SaveLocalStorage);
Cypress.Commands.add('restoreLocalStorage', RestoreLocalStorage);
