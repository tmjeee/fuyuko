import Path from 'path';
import fs from 'fs';
import util from 'util';
import {getViewByName, saveOrUpdateViews} from "../src/service/view.service";
import {View} from "../src/model/view.model";
import {getAttribute2sInView, saveAttributes} from "../src/service/attribute.service";
import {l} from "../src/logger/logger";
import {Attribute} from "../src/model/attribute.model";
import {addOrUpdateItem2, getItem2ById, getItem2ByName} from "../src/service/item.service";
import {
    Attribute2,
    Item2,
} from "../src/server-side-model/server-side.model";
import {itemRevert} from "../src/service/conversion-item.service";
import {attributesConvert,} from "../src/service/conversion-attribute.service";
import {Item} from "../src/model/item.model";
import {createNewItem} from "../src/shared-utils/ui-item-value-creator.utils";
import {setItemNumberValue, setItemStringValue} from "../src/shared-utils/ui-item-value-setter.util";
import {addItemImage} from "../src/service/item-image.service";


const runImport = async () => {
    // create view
    let view: View = await getViewByName('Cars');
    if (!view) {
        await saveOrUpdateViews([
            {
                id: -1,
                name: 'Cars',
                description: 'Cars View'
            } as View
        ]);
        view = await getViewByName('Cars');
    }


    // create attributes
    let attribute2s: Attribute2[] = await getAttribute2sInView(view.id);
    if (!attribute2s || !attribute2s.length) {
        await saveAttributes(view.id, [
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
        attribute2s = await getAttribute2sInView(view.id);
    }
    const attributes: Attribute[] = attributesConvert(attribute2s);


    // create items & images for all files
    const pathToAssetsDir: string = Path.join(__dirname, 'asset2');
    const filesInDir: string[] = await util.promisify(fs.readdir)(pathToAssetsDir);
    for (const fileInDir of filesInDir) {
        const fileSegments: string[] = fileInDir.split('_');
        const name = fileInDir.substring(0, fileInDir.indexOf('.'));
        const make = fileSegments[0];
        const model = fileSegments[1];
        const year = fileSegments[2];

       let item2: Item2 = await getItem2ByName(view.id, name);
       let primaryImage = false;
       if (!item2) {  //  item not already exists
           const item: Item = createNewItem(-1, attributes);
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

           item2 = itemRevert(item);
           await addOrUpdateItem2(view.id, item2);
           item2 = await getItem2ByName(view.id, item2.name);
           primaryImage = true;
       }

       const image: Buffer = await util.promisify(fs.readFile)(Path.join(pathToAssetsDir, fileInDir));
       await addItemImage(item2.id, fileInDir, image, primaryImage);
    }
};


(async function() {
    console.log('testing');
    await runImport();
    console.log('done testing');
}());
