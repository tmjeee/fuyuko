import {doInDbConnection} from "../src/db";
import Path from 'path';
import fs from 'fs';
import util from 'util';
import {Connection} from "mariadb";
import {getViewByName, saveOrUpdateViews} from "../src/service/view.service";
import {View} from "../src/model/view.model";
import {getAttribute2sInView, saveAttributes} from "../src/service/attribute.service";
import {l} from "../src/logger/logger";
import {Attribute} from "../src/model/attribute.model";
import {addOrUpdateItem2, getItem2ById, getItem2ByName} from "../src/service/item.service";
import {
    Attribute2,
    Item2,
    ItemMetadata2,
    ItemMetadataEntry2,
    ItemValue2
} from "../src/server-side-model/server-side.model";
import {itemConvert, itemRevert} from "../src/service/conversion-item.service";
import {attributeConvert, attributesConvert,} from "../src/service/conversion-attribute.service";
import {Item, ItemImage, StringValue, Value} from "../src/model/item.model";
import {createNewItem, createNewItemValue} from "../src/shared-utils/ui-item-value-creator.utils";
import {setItemNumberValue, setItemStringValue, setItemValue} from "../src/shared-utils/ui-item-value-setter.util";
import {addItemImage} from "../src/service/item-image.service";


const runImport = async (conn: Connection) => {
    // create view
    await saveOrUpdateViews([
        {
            id: -1,
            name: 'Cars',
            description: 'Cars View'
        } as View
    ]);

    const view: View = await getViewByName('Cars');
    if (!view) {
        throw new Error(`Unable to get view Cars`);
    }


    // create attributes
    await saveAttributes(view.id, [
        {
           id: -1,
           name: `Make`,
           type: 'string'
        }  as Attribute,
        {
            id: -1,
            name: `Model`,
            type: 'string'
        } as Attribute,
        {
            id: -1,
            name: 'Year',
            type: 'number'
        } as Attribute
    ], (level, msg) => l(level, msg));
    const attribute2s: Attribute2[] = await getAttribute2sInView(view.id);
    const attributes: Attribute[] = attributesConvert(attribute2s);

    const pathToAssetsDir: string = Path.join(__dirname, 'assets2');
    const filesInDir: string[] = await util.promisify(fs.readdir)(pathToAssetsDir);

    for (const fileInDir of filesInDir) {
        const fileSegments: string[] = fileInDir.split('_');
        const name = fileInDir.substring(fileInDir.indexOf('.'));
        const make = fileSegments[0];
        const model = fileSegments[1];
        const year = fileSegments[2];

       let item2: Item2 = await getItem2ByName(view.id, name);
       let primaryImage = false;
       if (!item2) {  //  not already exists

           const item: Item = createNewItem(-1, attributes);
           for (const attribute of attributes) {
               if (attribute.name === 'Name') {
                   setItemStringValue(attribute, item[attribute.id], name);
               } else if (attribute.name === 'Make') {
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
    await doInDbConnection((conn: Connection) => {

    });
}());
