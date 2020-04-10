import {ItemDataImport} from "../../model/data-import.model";
import {Attribute2, CsvItem} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {Item, Value} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";
import {getAttributesInView} from "../attribute.service";
import { convert } from "../conversion-attribute.service";
import {createNewItemValue} from "../../shared-utils/ui-item-value-creator.utils";
import {
    setItemAreaValue,
    setItemCurrencyValue,
    setItemDateValue, setItemDimensionValue, setItemDoubleSelectValue, setItemHeightValue, setItemLengthValue,
    setItemNumberValue, setItemSelectValue,
    setItemStringValue,
    setItemTextValue, setItemVolumeValue, setItemWidthValue
} from "../../shared-utils/ui-item-value-setter.util";
import {AreaUnits, DimensionUnits, HeightUnits, LengthUnits, VolumeUnits, WidthUnits} from "../../model/unit.model";


const createNewItem = (a: Attribute, csvValueFormat: string) => {
    const val: Value = { attributeId: a.id, val: undefined } as Value;
    switch (a.type) {
        case 'string': {
            setItemStringValue(a, val, csvValueFormat);
            break;
        }
        case 'text': {
            setItemTextValue(a, val, csvValueFormat);
            break;
        }
        case 'number': {
            setItemNumberValue(a, val, Number(csvValueFormat));
            break;
        }
        case 'date': {
            setItemDateValue(a, val, csvValueFormat);
            break;
        }
        case 'currency': {
            setItemCurrencyValue(a, val, Number(csvValueFormat));
            break;
        }
        case 'area': {
            const s: string[] = csvValueFormat.split('|');
            setItemAreaValue(a, val, Number(s[0]), s[1] as AreaUnits);
            break;
        }
        case 'volume': {
            const s: string[] = csvValueFormat.split('|');
            setItemVolumeValue(a, val, Number(s[0]), s[1] as VolumeUnits);
            break;
        }
        case 'dimension': {
            const s: string[] = csvValueFormat.split('|');
            setItemDimensionValue(a, val, Number(s[0]), Number(s[1]), Number(s[2]), s[3] as DimensionUnits);
            break;
        }
        case 'width': {
            const s: string[] = csvValueFormat.split('|');
            setItemWidthValue(a, val, Number(s[0]), s[1] as WidthUnits);
            break;
        }
        case 'height': {
            const s: string[] = csvValueFormat.split('|');
            setItemHeightValue(a, val, Number(s[0]), s[1] as HeightUnits);
            break;
        }
        case 'length': {
            const s: string[] = csvValueFormat.split('|');
            setItemLengthValue(a, val, Number(s[0]), s[1] as LengthUnits);
            break;
        }
        case 'select': {
            setItemSelectValue(a, val, csvValueFormat);
            break;
        }
        case 'doubleselect': {
            const s: string[] = csvValueFormat.split('|');
            setItemDoubleSelectValue(a, val, s[0], s[1]);
            break;
        }
    }
    return val;
}

export const preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<ItemDataImport> => {

    let counter: number = -1;

    const csvItems: CsvItem[]  = await readCsv<CsvItem>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const items: Item[] = [];
    const itemsMap: Map<string /* itemName */, Item /* children of this item id by itemName in the key */> = new Map();



    const att2s: Attribute2[] = await getAttributesInView(viewId);
    const attributes: Attribute[] = convert(att2s);

    const [attributeByIdMap, attributeByNameMap] = attributes.reduce((acc: [Map<number, Attribute>, Map<string, Attribute>], a: Attribute) => {
        acc[0].set(a.id, a);
        acc[1].set(a.name, a);
        return acc;
    }, [new Map(), new Map()]);


    let csvItemLineNumber = 1; // exclude header
    for (const csvItem of csvItems) {
        csvItemLineNumber++;
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
           creationDate: new Date(),
           lastUpdate: new Date(),
           children
        } as Item;
        if (!!!csvItem.parentName) {
            items.push(i);
        }
        itemsMap.set(itemsMapKey, i);
        if (itemsParentMapKey && itemsMap.has(itemsParentMapKey)) {
            itemsMap.get(itemsParentMapKey).children.push(i);
        }

        for (const pname of Object.keys(csvItem)) {
            if (!['parentName', 'name', 'description'].includes(pname)) {
                const kv: string[] = pname.split('=');
                const valueInString: string = csvItem[pname];
                // todo: conver this to Value type and set it
                if (kv && kv.length == 2) {
                    const k: string = kv[0];
                    const v: string = kv[1];

                    switch(k) {
                        case 'attId': {
                            const attId: number = Number(v);
                            const att: Attribute = attributeByIdMap.get(attId);
                            if (att) {
                                i[attId] = createNewItem(att, valueInString);
                            } else {
                                errors.push({
                                   title: `Attribute not found`,
                                   messsage: `Line ${csvItemLineNumber}: Attribute with id ${attId} not found in view ${viewId}`
                                } as Message);
                            }
                            break;
                        }
                        case 'attName': {
                            const attName: string = String(v);
                            const att: Attribute = attributeByNameMap.get(attName);
                            if (att) {
                                const attId: number = att.id;
                                i[attId] = createNewItem(att, valueInString);
                            } else {
                                errors.push({
                                    title: `Attribute not found`,
                                    messsage: `Line ${csvItemLineNumber}: Attribute with name ${attName} not found in view ${viewId}`
                                } as Message);
                            }
                            break;
                        }
                    }
                } else {
                    errors.push({
                       title: `Error`,
                       messsage: `Line ${csvItemLineNumber}: unable to parse key value pair ${pname}`
                    } as Message);
                }
            }
        }
    }

    return {
        type: "ITEM",
        dataImportId,
        attributes,
        items,
        messages: {
            errors,
            infos,
            warnings
        } as Messages
    } as ItemDataImport;
}
