import {LoginPage} from "./page-object/login.page";
import {PricingPage} from "./page-object/pricing.page";

describe(`pricing structure spece`, () => {

    let pricingPage: PricingPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        pricingPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitPricingPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        pricingPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        pricingPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it(`should select and display existing pricing structure`, () => {
        const pricingStructureName1 = `Pricing Structure #1`;
        const pricingStructureName2 = `Pricing Structure #2`;

        pricingPage
            .selectPricingStructure(pricingStructureName1)
            .verifyPricingStrucureHasItems(pricingStructureName1)
            .selectPricingStructure(pricingStructureName2)
            .verifyPricingStructureHasNoItems(pricingStructureName2)
        ;

    });

    it.only (`should create, edit, edit item in pricing structure and then delete pricing structure`, () => {

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
            .verifyPricingStructureDoNotExist(pricingStructureName)

            // create
            .clickAddNewPricingStructure()
            .editName(pricingStructureName)
            .editDescription(pricingStructureDescription)
            .selectView(viewName)
            .clickOk()
            .verifySuccessMessageExists()
            .verifyPricingStructureExists(pricingStructureName)

            // edit pricing structure
            .selectPricingStructure(pricingStructureName)
            .clickEditPricingStructure(pricingStructureName)
            .editName(newPricingStructureName)
            .editDescription(newPricingStructureDescription)
            .clickOk()
            .verifySuccessMessageExists()
            .verifyPricingStructureExists(newPricingStructureName)
            .verifyPricingStructureDoNotExist(pricingStructureName)

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

            .clickToExpandItem(pricingStructureName, `Item-1`)
            .verifyPricingStructureItemHasPrice(pricingStructureName, `Item-1`, 2.22, 'AUD')
            .verifyPricingStructureItemHasPrice(pricingStructureName, `Item-1-1`, 3.33, 'AUD')
            .verifyPricingStructureItemHasPrice(pricingStructureName, `Item-3`, 5.55, 'AUD')


            // delete
            .clickDeletePricingStructure(newPricingStructureName)
            .verifySuccessMessageExists()
            .verifyPricingStructureDoNotExist(pricingStructureName)
        ;
    });
});
