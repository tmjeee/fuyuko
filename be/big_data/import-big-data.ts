import Path from 'path';
import fs from 'fs';
import util from 'util';
import {getViewByName, saveOrUpdateViews} from "../src/service/view.service";
import {View} from "../src/model/view.model";
import {getAttributesInView, saveAttributes} from "../src/service/attribute.service";
import {l} from "../src/logger/logger";
import {Attribute} from "../src/model/attribute.model";
import {
    addOrUpdateItem,
    getItemByName
} from "../src/service/item.service";
import {Item} from "../src/model/item.model";
import {createNewItem} from "../src/shared-utils/ui-item-value-creator.utils";
import {setItemNumberValue, setItemStringValue} from "../src/shared-utils/ui-item-value-setter.util";
import {addItemImage} from "../src/service/item-image.service";
import {checkErrors} from "../src/updater/script-util";


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
    const pathToAssetsDir: string = Path.join(__dirname, 'asset2');
    const filesInDir: string[] = await util.promisify(fs.readdir)(pathToAssetsDir);
    for (const fileInDir of filesInDir) {
        const fileSegments: string[] = fileInDir.split('_');
        const name = fileInDir.substring(0, fileInDir.indexOf('.'));
        const make = fileSegments[0];
        const model = fileSegments[1];
        const year = fileSegments[2];

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


(async function() {
    console.log('testing');
    await runImport();
    console.log('done testing');
}());
