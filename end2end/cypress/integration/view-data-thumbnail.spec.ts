import {LoginPage} from "./page-object/login.page";
import {ViewDataThumbnailPage} from "./page-object/sub-page-object/view-data-thumbnail.page";


describe('view-data-thumbnail spec', () => {

    let viewDataThumbnailPage: ViewDataThumbnailPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewDataThumbnailPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewDataThumbnail();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        viewDataThumbnailPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        viewDataThumbnailPage
            .visit()
            .validateTitle()
        ;
    });

    it('should be searchable (basic search)', () => {
        viewDataThumbnailPage
            .doBasicSearch(`Item-2`)
            .verifyThumbnailsResultSize(1)
            .verifyThumbnailsHasItem(`Item-2`, true)
            .doBasicSearch('asdsdsdsdsdsdsdsds')
            .verifyThumbnailsResultSize(0)
            .verifyThumbnailsHasItem('asdsdsdsdsdsdsdsds', false)
        ;
    });

    it('should add / delete thumbnail', () => {
        const itemName = `Test-Item-${Math.random()}`;
        viewDataThumbnailPage
            .clickAddThumbnail(itemName)
            .verifyThumbnailsHasItem(itemName, true)
            .clickSave()
            .verifySuccessMessageExists()
            .clickDeleteThumbnail([itemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });


    it (`should show more / show less when clicked`, () => {
        const itemName = `Item-2`;
        viewDataThumbnailPage
            .clickItemShowMore(itemName)
            .verifyIsShowMore(itemName)
            .clickItemShowLess(itemName)
            .verifyIsShowLess(itemName)
    });



    it('should change name / description of thumbnail', ()=> {
        const itemName = `Test-Item-${Math.random()}`;
        const newItemName = `New-Test-Item-${Math.random()}`;
        const description = `New-Test-Item-Description-${Math.random()}`;
        viewDataThumbnailPage
            // verify name
            .clickAddThumbnail(itemName)
            .clickThumbnailItemName(itemName)
            .verifyPopupTitle()
            .editItemName(newItemName)
            .clickOk()
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailsHasItem(itemName, false)
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(newItemName, true)
            .verifyThumbnailsHasItem(itemName, false)

            // verify description
            .clickThumbnailItemDescription(newItemName)
            .verifyPopupTitle()
            .editItemDescription(description)
            .clickOk()
            .verifyThumbnailItemHasDescription(newItemName, description)
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailItemHasDescription(newItemName, description)

            // delete item
            .clickDeleteThumbnail([newItemName])
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailsHasItem(itemName, false)
        ;
    });

    it(`[string attribute] should change attributes of thumbnail`, () => {

        const itemName = `Test-Item-${Math.random()}`;
        const attributeName = `string attribute`;
        const value = `string-value-${Math.random()}`;

        viewDataThumbnailPage
            .clickAddThumbnail(itemName)
            .clickThumbnailItemAttribute(itemName, attributeName)
            .verifyPopupTitle()
            .editStringAttribute(value)
            .clickCancel(viewDataThumbnailPage)
            .verifyThumbnailItemHasNoAttributeValue(itemName, attributeName, [value])

            .clickThumbnailItemAttribute(itemName, attributeName)
            .editStringAttribute(value)
            .clickOk(viewDataThumbnailPage)
            .clickSave()
            .verifySuccessMessageExists()
            .verifyThumbnailItemHasAttributeValue(itemName, attributeName, [value])
        ;
    });


    it.only (`[string attribute] should allow editing of attributes through edit icon`, () => {

        const itemName = `Test-Item-${Math.random()}`;
        const attributeName = `string attribute`;
        const value = `string-value-${Math.random()}`;

        viewDataThumbnailPage
            .clickAddThumbnail(itemName)
            .clickEditThumbnailIcon(itemName)
            .verifyPopupTitle()
            .editStringAttribute(attributeName, value)
            .clickCancel()
            .verifyThumbnailItemHasNoAttributeValue(itemName, attributeName, [value])

            // .clickEditThumbnailIcon(`Item-2`)
            // .verifyPopupTitle()
            // .editStringAttribute(attributeName, value)
            // .clickOk()
            // .clickSave()
            // .verifySuccessMessageExists()
            // .verifyThumbnailItemHasAttributeValue(itemName, attributeName, [value])
        ;
    });
});
