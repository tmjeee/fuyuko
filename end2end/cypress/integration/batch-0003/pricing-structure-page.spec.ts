import {LoginPage} from "../page-object/login.page";
import {PricingPage} from "../page-object/pricing.page";

describe(`pricing structure spece`, () => {

    let pricingPage: PricingPage;

    before(() => {
        // const username = Cypress.env('username');
        // const password = Cypress.env('password');
        // pricingPage = new LoginPage()
        //     .visit()
        //     .login(username, password)
        //     .visitPricingPage();
    });

    after(() => {
        // localStorage.clear();
        // sessionStorage.clear();
    });


    beforeEach(() => {
        // cy.restoreLocalStorage();
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        pricingPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitPricingPage();
        pricingPage.visit();
    });

    afterEach(() => {
        // cy.saveLocalStorage();
    });

    it('should load', () => {
        pricingPage
            .validateTitle()
        ;
    });

    //////////////////

    it(`should select and display existing pricing structure`, () => {
        const viewName1 = `Test View 1`;
        const pricingStructureName1 = `Pricing Structure #1`;
        const viewName2 = `Test View 2`;
        const pricingStructureName2 = `Pricing Structure #2`;

        pricingPage
            .selectPricingStructure(viewName1, pricingStructureName1)
            .verifyPricingStrucureHasItems(pricingStructureName1)
            .selectPricingStructure(viewName1, pricingStructureName2)
            .verifyPricingStrucureHasItems(pricingStructureName2)
            .selectPricingStructure(viewName2, pricingStructureName1)
            .verifyPricingStrucureHasItems(pricingStructureName1)
            .selectPricingStructure(viewName2, pricingStructureName2)
            .verifyPricingStrucureHasItems(pricingStructureName2)
        ;
    });

    it(`should create, edit, edit item in pricing structure and then delete pricing structure`, () => {

        const viewName = `Test View 1`;
        const random = `${Math.random()}`;
        const pricingStructureName = `New-Pricing-Structure-${random}`;
        const pricingStructureDescription = `New-Pricing-Structure-Description-${random}`;

        const newPricingStructureName = `New-New-Pricing-Structure-${random}`;
        const newPricingStructureDescription = `New-New-Pricing-Structure-Description-${random}`;

        pricingPage
            .clickAddNewPricingStructure()
            .editName(pricingStructureName)
            .editDescription(pricingStructureDescription)
            .selectView(viewName)
            .clickCancel()
            .verifyPricingStructureDoNotExist(viewName, pricingStructureName)

            // create
            .clickAddNewPricingStructure()
            .editName(pricingStructureName)
            .editDescription(pricingStructureDescription)
            .selectView(viewName)
            .clickOk()
            .verifySuccessMessageExists()
            .verifyPricingStructureExists(viewName, pricingStructureName)

            // edit pricing structure
            .selectPricingStructure(viewName, pricingStructureName)
            .clickEditPricingStructure(pricingStructureName)
            .editName(newPricingStructureName)
            .editDescription(newPricingStructureDescription)
            .clickOk()
            .verifySuccessMessageExists()
            .verifyPricingStructureExists(viewName, newPricingStructureName)
            .verifyPricingStructureDoNotExist(viewName, pricingStructureName)

            // edit price
            .clickEditItemPricing(newPricingStructureName, `Item-1`)
            .verifyPopupTitle()
            .editPrice(2.22)
            .editUnit('AUD')
            .clickOk()
            .verifySuccessMessageExists()

            .clickToExpandItem(newPricingStructureName, `Item-1`)
            .clickEditItemPricing(newPricingStructureName, `Item-1-1`)
            .editPrice(3.33)
            .editUnit('AUD')
            .clickOk()
            .verifySuccessMessageExists()

            .clickEditItemPricing(newPricingStructureName, `Item-3`)
            .editPrice(5.55)
            .editUnit('AUD')
            .clickOk()
            .verifySuccessMessageExists()

            .clickToExpandItem(newPricingStructureName, `Item-1`)
            .verifyPricingStructureItemHasPrice(newPricingStructureName, `Item-1`, 2.22, 'AUD')
            .verifyPricingStructureItemHasPrice(newPricingStructureName, `Item-1-1`, 3.33, 'AUD')
            .verifyPricingStructureItemHasPrice(newPricingStructureName, `Item-3`, 5.55, 'AUD')


            // delete
            .clickDeletePricingStructure(newPricingStructureName)
            .verifySuccessMessageExists()
            .verifyPricingStructureDoNotExist(viewName, newPricingStructureName)
        ;
    });
});
