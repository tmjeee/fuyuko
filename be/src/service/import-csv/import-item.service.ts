import {ItemDataImport, PriceDataImport} from "../../model/data-import.model";
import {CsvItem, CsvPrice} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {Item} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";

export const preview = async (viewId: number, itemDataImportId: number, content: Buffer): Promise<ItemDataImport> => {

    let counter: number = -1;

    const csvItems: CsvItem[]  = await readCsv<CsvItem>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = [];
    const items: Item[] = [];

    const itemsMap: Map<string /* itemName */, Item> = new Map();
    const itemsParentMap: Map<string /* itemName */, Item[]> = new Map();

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
        itemsParentMap.set(itemsMapKey, children);
        itemsMap.set(itemsMapKey, i);

        if (itemsParentMapKey && itemsParentMap.has(itemsParentMapKey)) {
            itemsParentMap.get(itemsParentMapKey).push(i);
        }
    }

    return {
        type: "ITEM",
        itemDataImportId,
        attributes,
        items,
        messages: {
            errors,
            infos,
            warnings
        } as Messages
    } as ItemDataImport;
}
