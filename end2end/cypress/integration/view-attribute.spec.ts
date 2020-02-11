import {LoginPage} from "./page-object/login.page";
import {ViewAttributePage} from "./page-object/sub-page-object/view-attribute.page";


describe('view attribute spec', () => {

    let viewAttributePage: ViewAttributePage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        viewAttributePage = new LoginPage()
            .visit()
            .login(username, password)
            .visitViewPage()
            .visitViewAttributes();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        viewAttributePage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        viewAttributePage
            .visit()
            .validateTitle();
    });

    it('should be able to search for attribute', () => {
        viewAttributePage
            .search('')
            .verifyAttributeTableEntriesCount(13)
            .verifyAttributeTableHaveAttribute(`string attribute`)
            .verifyAttributeTableHaveAttribute(`text attribute`)
            .verifyAttributeTableHaveAttribute(`number attribute`)
            .verifyAttributeTableHaveAttribute(`date attribute`)
            .verifyAttributeTableHaveAttribute(`currency attribute`)
            .verifyAttributeTableHaveAttribute(`volume attribute`)
            .verifyAttributeTableHaveAttribute(`dimension attribute`)
            .verifyAttributeTableHaveAttribute(`area attribute`)
            .verifyAttributeTableHaveAttribute(`length attribute`)
            .verifyAttributeTableHaveAttribute(`width attribute`)
            .verifyAttributeTableHaveAttribute(`height attribute`)
            .verifyAttributeTableHaveAttribute(`select attribute`)
            .verifyAttributeTableHaveAttribute(`doubleselect attribute`)

            .search('s')
            .verifyAttributeTableEntriesCount(4)
            .verifyAttributeTableHaveAttribute(`string attribute`)
            .verifyAttributeTableHaveAttribute(`dimension attribute`)
            .verifyAttributeTableHaveAttribute(`select attribute`)
            .verifyAttributeTableHaveAttribute(`doubleselect attribute`)
        ;
    });

    it('should be able to add (fill in and change attribute type)', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;
        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .verifyAttributeNameFilledIn(name)
            .fillInAttributeDescription(description)
            .verifyAttributeDescriptionFilledIn(description)
            .selectAttributeType('string')
            .verifyAttributeTypeSelected('string')
            .selectAttributeType('text')
            .verifyAttributeTypeSelected('text')
            .selectAttributeType('number')
            .verifyAttributeTypeSelected('number')
            .selectAttributeType('date')
            .verifyAttributeTypeSelected('date')
            .selectAttributeType('currency')
            .verifyAttributeTypeSelected('currency')
            .selectAttributeType('volume')
            .verifyAttributeTypeSelected('volume')
            .selectAttributeType('dimension')
            .verifyAttributeTypeSelected('dimension')
            .selectAttributeType('area')
            .verifyAttributeTypeSelected('area')
            .selectAttributeType('width')
            .verifyAttributeTypeSelected('width')
            .selectAttributeType('length')
            .verifyAttributeTypeSelected('length')
            .selectAttributeType('height')
            .verifyAttributeTypeSelected('height')
            .selectAttributeType('select')
            .verifyAttributeTypeSelected('select')
            .selectAttributeType('doubleselect')
            .verifyAttributeTypeSelected('doubleselect')
        ;
    });

    it('should create string attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForStringAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForNumberAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });

    it('should create text attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForTextAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForStringAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });

    it('should create number attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForNumberAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForDateAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });

    it('should create date attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForDateAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForCurrencyAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it('should create currency attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForCurrencyAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForVolumeAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it ('should create volume attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForVolumeAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForDimensionAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it ('should create dimension attribute type', () => {

        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForDimensionAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForAreaAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it ('should create area attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForAreaAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForWidthAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it ('should create width attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForWidthAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForLengthAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it ('should create length attribute type', () => {

        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForLengthAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForHeightAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it ('should create height attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForHeightAttribute()
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForSelectAttribute([
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'},
            ])
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it('should create select attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForSelectAttribute([
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'},
                {key: 'key3', value: 'value3'},
                {key: 'key4', value: 'value4'},
                {key: 'key5', value: 'value5'},
            ])
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForDoubleSelectAttribute([
                {key: 'key1', value: 'value1', entries: [
                        {key2: 'akey1', value2: 'avalue1'},
                        {key2: 'akey2', value2: 'avalue2'},
                        {key2: 'akey3', value2: 'avalue3'},
                    ]},
                {key: 'key2', value: 'value2', entries: [
                        {key2: 'akey4', value2: 'avalue4'},
                        {key2: 'akey5', value2: 'avalue5'},
                        {key2: 'akey6', value2: 'avalue6'},
                    ]},
            ])
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });
    it('should create doubleselect attribute type', () => {
        const r = Math.random();
        const name =  `attribute-${r}`;
        const description = `description-${r}`;

        const newName = `new-${name}`;
        const newDescription = `new-${description}`;

        viewAttributePage
            .clickAddAttribute()
            .verifyTitle()
            .fillInAttributeName(name)
            .fillInAttributeDescription(description)
            .fillInForDoubleSelectAttribute([
                {key: 'key1', value: 'value1', entries: [
                        {key2: 'akey1', value2: 'avalue1'},
                        {key2: 'akey2', value2: 'avalue2'},
                        {key2: 'akey3', value2: 'avalue3'},
                    ]},
                {key: 'key2', value: 'value2', entries: [
                        {key2: 'akey4', value2: 'avalue4'},
                        {key2: 'akey5', value2: 'avalue5'},
                        {key2: 'akey6', value2: 'avalue6'},
                    ]},
                {key: 'key3', value: 'value3', entries: [
                        {key2: 'akey7', value2: 'avalue7'},
                        {key2: 'akey8', value2: 'avalue8'},
                        {key2: 'akey9', value2: 'avalue9'},
                    ]},
            ])
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(name)

            .clickEditAttribute(name)
            .verifyTitle()
            .fillInAttributeName(newName)
            .fillInAttributeDescription(newDescription)
            .fillInForSelectAttribute([
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'},
            ])
            .clickDone()
            .verifySuccessMessageExists()
            .clickBack()
            .verifyAttributeTableHaveAttribute(newName)

            .clickDeleteAttribute(newName)
        ;
    });

});
