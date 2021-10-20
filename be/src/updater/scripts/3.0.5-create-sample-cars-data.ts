import {UPDATER_PROFILE_CARS_DATA} from '../updater';
import {View} from '@fuyuko-common/model/view.model';
import {getViewByName, addOrUpdateViews} from '../../service';
import {getAttributeInViewByName, getAttributesInView, saveAttributes, addCategory, AddCategoryInput, addItemToPricingStructure,
    addItemToViewCateogry, addOrUpdateItem, addOrUpdatePricingStructures, addOrUpdateRules, getGroupByName, getItemByName,
    getPricingStructureByName, getViewCategoryByName, linkPricingStructureWithGroupId, setPrices, addItemImage,
    AddOrUpdatePricingStructureInput
} from '../../service';

import {checkErrors, checkNotNull, checkTrue} from '../script-util';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {i, l} from '../../logger/logger';
import Path from 'path';
import util from 'util';
import fs from 'fs';
import {Item} from '@fuyuko-common/model/item.model';
import {createNewItem} from '@fuyuko-common/shared-utils/ui-item-value-creator.utils';
import {setItemNumberValue, setItemStringValue} from '@fuyuko-common/shared-utils/ui-item-value-setter.util';
import {Category} from '@fuyuko-common/model/category.model';
import {Rule, ValidateClause} from '@fuyuko-common/model/rule.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {Group, GROUP_ADMIN, GROUP_PARTNER} from '@fuyuko-common/model/group.model';
import {getItemValue} from "@fuyuko-common/shared-utils/item.util";

export const profiles = [UPDATER_PROFILE_CARS_DATA];

const prices: number[] = [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000];


export const update = async () => {

    i(`running scripts in ${__filename}`);

    await runImport();

    i(`done running update on ${__filename}`);
};

const runImport = async () => {

    // find groups
    const adminGroup: Group = (await getGroupByName(GROUP_ADMIN));
    checkNotNull(adminGroup, `Failed to find admin group`);
    const partnerGroup: Group = (await getGroupByName(GROUP_PARTNER));
    checkNotNull(partnerGroup, `Failed to find partner group`);

    const adminGroupId: number = adminGroup.id;
    const partnerGroupId: number = partnerGroup.id;


    // create view
    let view: View = await getViewByName('Cars');
    if (!view) {
        const errors: string[] = await addOrUpdateViews([
            {
                id: -1,
                name: 'Cars',
                description: 'Cars View'
            } as View
        ]);
        checkErrors(errors, `Failed to create Cars view`);
        view = await getViewByName('Cars');
    }


    // create attributes
    const attYear = `Year`;
    const attModel = `Model`;
    const attMake = `Make`;
    let attributes: Attribute[] = await getAttributesInView(view.id);
    if (!attributes || !attributes.length) {
        const errors: string[] = await saveAttributes(view.id, [
            {
                id: -1,
                name: attMake,
                type: 'string',
                description: 'Make description'
            }  as Attribute,
            {
                id: -1,
                name: attModel,
                type: 'string',
                description: 'Model description'
            } as Attribute,
            {
                id: -1,
                name: attYear,
                type: 'number',
                description: 'Year description'
            } as Attribute
        ], (level, msg) => l(level, msg));
        checkErrors(errors, `Failed ot create attributes for Cars view`);
        attributes = await getAttributesInView(view.id);
    }
    const makeAttribute = await getAttributeInViewByName(view.id, attMake);
    checkNotNull(makeAttribute, `Failed to retrieve ${attMake} attribute`);
    const modelAttribute = await getAttributeInViewByName(view.id, attModel);
    checkNotNull(modelAttribute, `Failed to retrieve ${attModel} attribute`);
    const yearAttribute = await getAttributeInViewByName(view.id, attYear);
    checkNotNull(yearAttribute, `Failed to retrieve ${attYear} attribute`);


    // pricing structure
    const PRICING_STRUCTURE_NAME = `Cars Standard Pricing Structure`;
    const errs: string[] = await addOrUpdatePricingStructures([{
        id: -1, name: PRICING_STRUCTURE_NAME, description: 'Cars collections standard Pricing Structure', status: "ENABLED", viewId: view.id
    } as AddOrUpdatePricingStructureInput])
    checkErrors(errs, `Failed to create cars pricing structure`);
    const pricingStructure: PricingStructure = await getPricingStructureByName(view.id, PRICING_STRUCTURE_NAME);
    checkNotNull(pricingStructure, `Failed to find pricing structure ${pricingStructure}`);

    // link pricing structure to group
    const errors1 = await linkPricingStructureWithGroupId(pricingStructure.id, adminGroupId);
    checkErrors(errors1, `Failed to link group ${adminGroup.name} with Id ${adminGroupId} with pricing structure ${pricingStructure.id}`);
    const errors2 = await linkPricingStructureWithGroupId(pricingStructure.id, partnerGroupId);
    checkErrors(errors2, `Failed to link group ${partnerGroup.name} with Id ${partnerGroupId} with pricing structure ${pricingStructure.id}`);



    // create items & images for all files & categories
    const pathToAssetsDir: string = Path.join(__dirname, '../assets/cars-data-images');
    const filesInDir: string[] = await util.promisify(fs.readdir)(pathToAssetsDir);
    let i = -1;
    for (const fileInDir of filesInDir) {
        i++;
        const filename = fileInDir.substring(0, fileInDir.indexOf('.'));
        const fileSegments: string[] = fileInDir.split('_');
        const make = fileSegments[0];
        const model = fileSegments[1];
        const year = fileSegments[2];
        const name = `${make}_${model}_${year}`;

        let item: Item | undefined = await getItemByName(view.id, name);
        let primaryImage = false;
        if (!item) {  //  item not already exists
            item = createNewItem(-1, attributes);
            item.name = name;
            item.description = `${name} description`;
            for (const attribute of attributes) {
                if (attribute.name === 'Make') {
                    setItemStringValue(attribute, getItemValue(item, attribute.id)!, make);
                } else if (attribute.name === 'Model') {
                    setItemStringValue(attribute, getItemValue(item, attribute.id)!, model);
                } else if (attribute.name === 'Year') {
                    setItemNumberValue(attribute, getItemValue(item, attribute.id)!, Number(year));
                }
            }

            const errors: string[] = await addOrUpdateItem(view.id, item);
            checkErrors(errors, `Failed to create item ${name} for Cars view`);
            item = await getItemByName(view.id, item.name);
            if (!item) {
                throw new Error(`Failed to create item ${item!.name}`);
            }
            primaryImage = true;


            let makeCategory: Category | undefined = await getViewCategoryByName(view.id, make);
            if (!makeCategory) {
                const err: string[] = await addCategory(view.id, undefined, { name: make, description: make, children: []} as AddCategoryInput);
                checkErrors(err, `Failed to create category ${make}`);
                makeCategory = await getViewCategoryByName(view.id, make);
                checkNotNull(makeCategory, `Failed to find newly created category ${make}`);
            }
            let yearCategory: Category | undefined = await getViewCategoryByName(view.id, year, makeCategory!.id);
            if (!yearCategory) {
                const err: string[] = await addCategory(view.id, makeCategory!.id, { name: `${year}`, description: `${year}`, children: []} as AddCategoryInput);
                checkErrors(err, `Failed to create category ${year} under parent category ${make}`);
                yearCategory = await getViewCategoryByName(view.id, year, makeCategory!.id);
                checkNotNull(yearCategory, `Failed to find newly created category ${year} under parent category ${make}`);
            }
            let modelCategory: Category | undefined = await getViewCategoryByName(view.id, model, yearCategory!.id);
            if (!modelCategory) {
                const err: string[] = await addCategory(view.id, yearCategory!.id, { name: model, description: model, children: []} as AddCategoryInput);
                checkErrors(err, `Failed to create category ${model} under parent category ${year} under parent category ${make}`);
                modelCategory = await getViewCategoryByName(view.id, model, yearCategory!.id);
                checkNotNull(modelCategory, `Failed to find newly created category ${model} under parent category ${year} under parent category ${make}`);
            }

            const err1: string[] = await addItemToViewCateogry(makeCategory!.id, item.id);
            checkErrors(err1, `Failed to add item ${item.name} to category ${makeCategory!.name}`);

            const err2: string[] = await addItemToViewCateogry(yearCategory!.id, item.id);
            checkErrors(err2, `Failed to add item ${item.name} to category ${yearCategory!.name} under parent category ${makeCategory!.name}`);

            const err3: string[] = await addItemToViewCateogry(modelCategory!.id, item.id);
            checkErrors(err3, `Failed to add item ${item.name} to category ${modelCategory!.name} under parent Category ${yearCategory!.name} under parent Category ${makeCategory!.name}`);


            const r: boolean = await addItemToPricingStructure(view.id, pricingStructure.id, item.id);
            checkTrue(r, `Failed to add item ${item.name} with id ${item.id} to pricing structure ${pricingStructure.name} with id ${pricingStructure.id}`);


            // pricing
            const errs: string[] = await setPrices([{
                pricingStructureId: pricingStructure.id,
                item: {price: prices[i%prices.length], itemId: item.id, country: 'AUD'}
            }]);
            checkErrors(errs, `Failed to set price for item id ${item.id} named ${item.name}`);
        }

        const image: Buffer = await util.promisify(fs.readFile)(Path.join(pathToAssetsDir, fileInDir));
        const ok: boolean  = await addItemImage(item.id, fileInDir, image, primaryImage);
        if (!ok) {
            throw new Error(`Failed to add image for item ${item.name}`);
        }
    }


    // create rules
    const err: string[] = await addOrUpdateRules(view.id, [
        {
           id: -1,
           name: `${attMake} should not be empty`,
           description: `validate that ${attMake} should not be empty`,
           status: 'ENABLED',
           level: 'ERROR',
           whenClauses: [],
           validateClauses: [
               {
                  id: -1,
                  attributeId: makeAttribute!.id,
                  attributeName: makeAttribute!.name,
                  attributeType: makeAttribute!.type,
                  operator: 'not empty'
               } as ValidateClause
           ]
        } as Rule,
        {
            id: -1,
            name: `${attModel} should not be empty`,
            description: `validate that ${attModel} should not be empty`,
            status: 'ENABLED',
            level: 'ERROR',
            whenClauses: [],
            validateClauses: [
                {
                    id: -1,
                    attributeId: modelAttribute!.id,
                    attributeName: modelAttribute!.name,
                    attributeType: modelAttribute!.type,
                    operator: 'not empty'
                } as ValidateClause
            ]
        } as Rule,
        {
            id: -1,
            name: `${attYear} should not be empty`,
            description: `validate that ${attYear} should not be empty`,
            status: 'ENABLED',
            level: 'ERROR',
            whenClauses: [],
            validateClauses: [
                {
                    id: -1,
                    attributeId: yearAttribute!.id,
                    attributeName: yearAttribute!.name,
                    attributeType: yearAttribute!.type,
                    operator: 'not empty'
                } as ValidateClause
            ]
        } as Rule,
    ]);
    checkErrors(err, `Failed to create rules`);




};

