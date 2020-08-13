import {UPDATER_PROFILE_CARS_DATA} from "../updater";
import {View} from "../../model/view.model";
import {getViewByName, addOrUpdateViews} from "../../service/view.service";
import {checkErrors, checkNotNull} from "../script-util";
import {Attribute} from "../../model/attribute.model";
import {getAttributesInView, saveAttributes} from "../../service/attribute.service";
import {i, l} from "../../logger/logger";
import Path from "path";
import util from "util";
import fs from "fs";
import {Item} from "../../model/item.model";
import {
    addCategory,
    AddCategoryInput,
    addItemToViewCateogry,
    addOrUpdateItem,
    getItemByName,
    getViewCategoryByName
} from "../../service";
import {createNewItem} from "../../shared-utils/ui-item-value-creator.utils";
import {setItemNumberValue, setItemStringValue} from "../../shared-utils/ui-item-value-setter.util";
import {addItemImage} from "../../service/item-image.service";
import {Category} from "../../model/category.model";

export const profiles = [UPDATER_PROFILE_CARS_DATA];


export const update = async () => {

    i(`running scripts in ${__filename}`);

    await runImport();

    i(`done running update on ${__filename}`);
};

const runImport = async () => {
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
    let attributes: Attribute[] = await getAttributesInView(view.id);
    if (!attributes || !attributes.length) {
        const errors: string[] = await saveAttributes(view.id, [
            {
                id: -1,
                name: `Make`,
                type: 'string',
                description: 'Make description'
            }  as Attribute,
            {
                id: -1,
                name: `Model`,
                type: 'string',
                description: 'Model description'
            } as Attribute,
            {
                id: -1,
                name: 'Year',
                type: 'number',
                description: 'Year description'
            } as Attribute
        ], (level, msg) => l(level, msg));
        checkErrors(errors, `Failed ot create attributes for Cars view`);
        attributes = await getAttributesInView(view.id);
    }


    // create items & images for all files & categories
    const pathToAssetsDir: string = Path.join(__dirname, '../assets/cars-data-images');
    const filesInDir: string[] = await util.promisify(fs.readdir)(pathToAssetsDir);
    for (const fileInDir of filesInDir) {
        const filename = fileInDir.substring(0, fileInDir.indexOf('.'));
        const fileSegments: string[] = fileInDir.split('_');
        const make = fileSegments[0];
        const model = fileSegments[1];
        const year = fileSegments[2];
        const name = `${make}_${model}_${year}`;

        let item: Item = await getItemByName(view.id, name);
        let primaryImage = false;
        if (!item) {  //  item not already exists
            item = createNewItem(-1, attributes);
            item.name = name;
            item.description = `${name} description`;
            for (const attribute of attributes) {
                if (attribute.name === 'Make') {
                    setItemStringValue(attribute, item[attribute.id], make);
                } else if (attribute.name === 'Model') {
                    setItemStringValue(attribute, item[attribute.id], model);
                } else if (attribute.name === 'Year') {
                    setItemNumberValue(attribute, item[attribute.id], Number(year));
                }
            }

            const errors: string[] = await addOrUpdateItem(view.id, item);
            checkErrors(errors, `Failed to create item ${name} for Cars view`);
            item = await getItemByName(view.id, item.name);
            if (!item) {
                throw new Error(`Failed to create item ${item.name}`);
            }
            primaryImage = true;


            let makeCategory: Category = await getViewCategoryByName(view.id, make);
            if (!makeCategory) {
                const err: string[] = await addCategory(view.id, null, { name: make, description: make, children: []} as AddCategoryInput);
                checkErrors(err, `Failed to create category ${make}`);
                makeCategory = await getViewCategoryByName(view.id, make);
                checkNotNull(makeCategory, `Failed to find newly created category ${make}`);
            }
            let yearCategory: Category = await getViewCategoryByName(view.id, year, makeCategory.id);
            if (!yearCategory) {
                const err: string[] = await addCategory(view.id, makeCategory.id, { name: `${year}`, description: `${year}`, children: []} as AddCategoryInput);
                checkErrors(err, `Failed to create category ${year} under parent category ${make}`);
                yearCategory = await getViewCategoryByName(view.id, year, makeCategory.id);
                checkNotNull(yearCategory, `Failed to find newly created category ${year} under parent category ${make}`);
            }
            let modelCategory: Category = await getViewCategoryByName(view.id, model, yearCategory.id);
            if (!modelCategory) {
                const err: string[] = await addCategory(view.id, yearCategory.id, { name: model, description: model, children: []} as AddCategoryInput);
                checkErrors(err, `Failed to create category ${model} under parent category ${year} under parent category ${make}`);
                modelCategory = await getViewCategoryByName(view.id, model, yearCategory.id);
                checkNotNull(modelCategory, `Failed to find newly created category ${model} under parent category ${year} under parent category ${make}`);
            }

            const err1: string[] = await addItemToViewCateogry(makeCategory.id, item.id);
            checkErrors(err1, `Failed to add item ${item.name} to category ${makeCategory.name}`);

            const err2: string[] = await addItemToViewCateogry(yearCategory.id, item.id);
            checkErrors(err2, `Failed to add item ${item.name} to category ${yearCategory.name} under parent category ${makeCategory.name}`);

            const err3: string[] = await addItemToViewCateogry(modelCategory.id, item.id);
            checkErrors(err3, `Failed to add item ${item.name} to category ${modelCategory.name} under parent Category ${yearCategory.name} under parent Category ${makeCategory.name}`);
        }

        const image: Buffer = await util.promisify(fs.readFile)(Path.join(pathToAssetsDir, fileInDir));
        const ok: boolean  = await addItemImage(item.id, fileInDir, image, primaryImage);
        if (!ok) {
            throw new Error(`Failed to add image for item ${item.name}`);
        }
    }



};

