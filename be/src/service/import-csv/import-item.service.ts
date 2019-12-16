import {ItemDataImport} from "../../model/data-import.model";
import {Attribute2, CsvItem} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {Item} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";
import {getAttributesInView} from "../attribute.service";
import { convert } from "../conversion-attribute.service";
import {createNewItemValue} from "../../shared-utils/ui-item-value-creator.utils";

export const preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<ItemDataImport> => {

    let counter: number = -1;

    const csvItems: CsvItem[]  = await readCsv<CsvItem>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const itemsMap: Map<string /* itemName */, Item> = new Map();
    const itemsChildrenMap: Map<string /* itemName */, Item[]> = new Map();



    const att2s: Attribute2[] = await getAttributesInView(viewId);
    const attributes: Attribute[] = convert(att2s);

    const [attributeByIdMap, attributeByNameMap] = attributes.reduce((acc: [Map<number, Attribute>, Map<string, Attribute>], a: Attribute) => {
        acc[0].set(a.id, a);
        acc[1].set(a.name, a);
        return acc;
    }, [new Map(), new Map()]);


    for (const csvItem of csvItems) {
        const itemsMapKey: string = `${csvItem.name}`;
        const itemsParentMapKey: string = csvItem.parentName ? `${csvItem.parentName}` : undefined;
        const parentItem: Item = itemsMap.get(itemsParentMapKey);
        const children: Item[] = [];
        const i: Item = {
           id: counter--,
           name: csvItem.name,
           description: csvItem.description,
           images: [],
           parentId: parentItem ? parentItem.id : null,
           children
        } as Item;
        if (itemsMapKey) {
            itemsChildrenMap.set(itemsMapKey, children);
        }
        itemsMap.set(itemsMapKey, i);
        if (itemsParentMapKey && itemsChildrenMap.has(itemsParentMapKey)) {
            itemsChildrenMap.get(itemsParentMapKey).push(i);
        }

        for (const pname of Object.keys(csvItem)) {
            if (!['parentName', 'name', 'description'].includes(pname)) {
                const kv: string[] = pname.split('=');
                if (kv && kv.length == 2) {
                    const k: string = kv[0];
                    const v: string = kv[1];

                    switch(k) {
                        case 'attrId': {
                            const attId: number = Number(v);
                            const att: Attribute = attributeByIdMap.get(attId);
                            if (att) {
                                i[attId] = createNewItemValue(att, true);
                            } else {
                                errors.push({
                                   title: `Attribute not found`,
                                   messsage: `Attribute with id ${attId} not found in view ${viewId}`
                                } as Message);
                            }
                            break;
                        }
                        case 'attrName': {
                            const attName: string = String(v);
                            const att: Attribute = attributeByNameMap.get(attName);
                            if (att) {
                                const attId: number = att.id;
                                i[attId] = createNewItemValue(att, true);
                            } else {
                                errors.push({
                                    title: `Attribute not found`,
                                    messsage: `Attribute with name ${attName} not found in view ${viewId}`
                                } as Message);
                            }
                            break;
                        }
                    }
                } else {
                    errors.push({
                       title: `Error`,
                       messsage: ` unable to parse key value pair ${pname}`
                    } as Message);
                }
            }
        }
    }

    return {
        type: "ITEM",
        dataImportId,
        attributes,
        items: [...itemsMap.values()],
        messages: {
            errors,
            infos,
            warnings
        } as Messages
    } as ItemDataImport;
}
