import {ItemDataImport} from "../../model/data-import.model";
import {CsvItem} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {Item} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";

export const preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<ItemDataImport> => {

    let counter: number = -1;

    const csvItems: CsvItem[]  = await readCsv<CsvItem>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = [];
    const items: Item[] = [];

    const itemsMap: Map<string /* itemName */, Item> = new Map();
    const itemsChildrenMap: Map<string /* itemName */, Item[]> = new Map();

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
        itemsChildrenMap.set(itemsMapKey, children);
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
                        case 'attrId':

                            break;
                        case 'attrName':

                            break;
                    }
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
