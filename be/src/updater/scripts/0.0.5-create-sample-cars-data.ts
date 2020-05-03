import {UPDATER_PROFILE_CARS_DATA} from "../updater";
import {View} from "../../model/view.model";
import {getViewByName, saveOrUpdateViews} from "../../service/view.service";
import {checkErrors} from "../script-util";
import {Attribute} from "../../model/attribute.model";
import {getAttributesInView, saveAttributes} from "../../service/attribute.service";
import {i, l} from "../../logger/logger";
import Path from "path";
import util from "util";
import fs from "fs";
import {Item} from "../../model/item.model";
import {addOrUpdateItem, getItemByName} from "../../service";
import {createNewItem} from "../../shared-utils/ui-item-value-creator.utils";
import {setItemNumberValue, setItemStringValue} from "../../shared-utils/ui-item-value-setter.util";
import {addItemImage} from "../../service/item-image.service";

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
        const errors: string[] = await saveOrUpdateViews([
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


    // create items & images for all files
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
        }

        const image: Buffer = await util.promisify(fs.readFile)(Path.join(pathToAssetsDir, fileInDir));
        const ok: boolean  = await addItemImage(item.id, fileInDir, image, primaryImage);
        if (!ok) {
            throw new Error(`Failed to add image for item ${item.name}`);
        }
    }
};

