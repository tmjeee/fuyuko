import {ItemDataImport} from "../../model/data-import.model";
import {CsvItem} from "../../server-side-model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {Item, ItemImage, Value} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";
import * as fileType from 'file-type';
import {
    setItemAreaValue,
    setItemCurrencyValue,
    setItemDateValue, setItemDimensionValue, setItemDoubleSelectValue, setItemHeightValue, setItemLengthValue,
    setItemNumberValue, setItemSelectValue,
    setItemStringValue,
    setItemTextValue, setItemVolumeValue, setItemWeightValue, setItemWidthValue
} from "../../shared-utils/ui-item-value-setter.util";
import {
    AreaUnits,
    DimensionUnits,
    HeightUnits,
    LengthUnits,
    VolumeUnits,
    WeightUnits,
    WidthUnits
} from "../../model/unit.model";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {File} from "formidable";
import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import {FileTypeResult} from "file-type";
import {unzipFromBuffer, unzipFromPath} from "../../util/zip.util";
import JSZip from "jszip";
import {w} from "../../logger";
import {fireEvent, ImportItemPreviewEvent} from "../event/event.service";
import {getAttributesInView} from "../index";
const uuid = require('uuid');
const detectCsv = require('detect-csv');

/**
 * ==========================
 * === preview ===
 * ==========================
 */
export interface ImportItemPreviewResult { errors: string[], itemDataImport: ItemDataImport};
export const preview = async (viewId: number, itemDataCsvFile: File): Promise<ImportItemPreviewResult> => {
    return await doInDbConnection(async (conn: Connection) => {

        const errors: string[] = [];
        const name: string = `item-data-import-${uuid()}`;
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ITEM')`, [viewId, name]);
        const dataImportId: number = q.insertId;

        // note: itemDataCsvFile.path is the full path to the uploaded file / artifact itself
        const content: Buffer  = await util.promisify(fs.readFile)(itemDataCsvFile.path);
        const fileTypeResult: FileTypeResult = await fileType.fromBuffer(content);

        let mimeType = undefined;
        let isZip = false;
        if (fileTypeResult && fileTypeResult.mime == 'application/zip') {
            mimeType = 'application/zip';
            isZip = true;
        }
        else if (detectCsv(content)) { // normal csv file upload
            mimeType = 'text/csv';
        } else {
            errors.push(`Only support csv import`)
            return {
                errors, itemDataImport: null
            };
        }

        const fileName = path.basename(itemDataCsvFile.name);
        await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
            [dataImportId, fileName, mimeType, content.length, content]);


        // issue #93: need to pass all content as array if in zip format, and also save image for item in zip to TBL_DATA_IMPORT_FILE
        const csvBuffers: BufferInfo[] = [];
        if (isZip) {
            const jszip: JSZip = await unzipFromBuffer(content, `${path.join(path.dirname(itemDataCsvFile.path), )}`);
            for (const file in jszip.files) {
                if (!file) { // file can be null
                    continue;
                }
                const jszipObject: JSZip.JSZipObject = jszip.file(file);
                if (jszipObject &&  !jszipObject.dir) {
                    const b: Buffer = await jszipObject.async('nodebuffer');
                    const ft: fileType.FileTypeResult = await fileType.fromBuffer(b);
                    if (ft && ft.mime.startsWith('image/')) { // image
                        // this is the image inside the zip
                        await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                            [dataImportId, jszipObject.name, ft.mime, b.length, b]);
                    } else if (detectCsv(b)) { // csv
                        // this is the csv file inside the zip
                        await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
                            [dataImportId, jszipObject.name, 'text/csv', b.length, b]);
                        csvBuffers.push({
                            fileName,
                            entryName: jszipObject.name,
                            content: b
                        });
                    } else {
                        w(`Unrecognized file ${jszipObject.name} inside zip file ${itemDataCsvFile.path}`);
                    }
                }
            }
        } else { // csv
            csvBuffers.push({
                fileName,
                entryName: undefined,
                content
            });
        }

        const itemDataImport: ItemDataImport = await _preview(viewId, dataImportId, csvBuffers);
        const r: ImportItemPreviewResult = {errors, itemDataImport};
        
        fireEvent({
           type: "ImportItemPreviewEvent",
           previewResult: r 
        } as ImportItemPreviewEvent);
        
        return r;
    });
}

interface Context {
    counter: number,
    viewId: number,
    dataImportId: number,
    attributeByIdMap: Map<number, Attribute>,
    attributeByNameMap: Map<string, Attribute>,
    errors: Message[],
    infos: Message[],
    warnings: Message[],
};

const _preview = async (viewId: number, dataImportId: number, bufferInfos: BufferInfo[]): Promise<ItemDataImport> => {

    let counter: number = -1;
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = await getAttributesInView(viewId);

    const [attributeByIdMap, attributeByNameMap] = attributes.reduce((acc: [Map<number, Attribute>, Map<string, Attribute>], a: Attribute) => {
        acc[0].set(a.id, a);
        acc[1].set(a.name, a);
        return acc;
    }, [new Map(), new Map()]);

    const context: Context = {
        counter,
        viewId,
        dataImportId,
        attributeByIdMap,
        attributeByNameMap,
        errors,
        infos,
        warnings,
    };

    const items: Item[] = [];
    for (const bufferInfo of bufferInfos) {
       const i: Item[] =  await __preview(context, bufferInfo);
       items.push(...i);
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

const __preview = async (context: Context, bufferInfo: BufferInfo): Promise<Item[]> => {

    const csvItems: CsvItem[]  = await readCsv<CsvItem>(bufferInfo.content);

    const items: Item[] = [];
    const itemsMap: Map<string /* itemName */, Item /* children of this item id by itemName in the key */> = new Map();

    let csvItemLineNumber = 1; // exclude header
    for (const csvItem of csvItems) {
        csvItemLineNumber++;
        const itemsMapKey: string = `${csvItem.name}`;
        const itemsParentMapKey: string = csvItem.parentName ? `${csvItem.parentName}` : undefined;
        const parentItem: Item = itemsMap.get(itemsParentMapKey);
        const children: Item[] = [];
        const i: Item = {
           id: context.counter--,
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

                if (kv && kv.length == 1 && kv[0] == 'image') {
                    const imagesPath: string[] = valueInString.split('|');
                    const itemImages: ItemImage[] = imagesPath.reduce((acc: ItemImage[], imagePath: string) => {
                        acc.push({
                           id: -1,
                           primary: false,
                           name: imagePath,
                           mimeType: '',
                           size: 0
                        });
                        return acc;
                    }, []);
                    i.images.push(...itemImages);
                }
                else if (kv && kv.length == 2) {
                    const k: string = kv[0];
                    const v: string = kv[1];

                    switch(k) {
                        case 'attId': {
                            const attId: number = Number(v);
                            const att: Attribute = context.attributeByIdMap.get(attId);
                            if (att) {
                                i[attId] = createNewItemValue(att, valueInString);
                            } else {
                                context.errors.push({
                                   title: `Attribute not found`,
                                   messsage: `File ${bufferInfo.fileName}, ${bufferInfo.entryName? 'entry '+ bufferInfo.entryName +',' : ''} Line ${csvItemLineNumber}: Attribute with id ${attId} not found in view ${context.viewId}`
                                } as Message);
                            }
                            break;
                        }
                        case 'attName': {
                            const attName: string = String(v);
                            const att: Attribute = context.attributeByNameMap.get(attName);
                            if (att) {
                                const attId: number = att.id;
                                i[attId] = createNewItemValue(att, valueInString);
                            } else {
                                context.errors.push({
                                    title: `Attribute not found`,
                                    messsage: `File ${bufferInfo.fileName}, ${bufferInfo.entryName? 'entry '+ bufferInfo.entryName +',' : ''} Line ${csvItemLineNumber}: Attribute with name ${attName} not found in view ${context.viewId}`
                                } as Message);
                            }
                            break;
                        }
                    }
                } else {
                    context.errors.push({
                       title: `Error`,
                       messsage: `File ${bufferInfo.fileName}, ${bufferInfo.entryName? 'entry '+ bufferInfo.entryName +',' : ''} Line ${csvItemLineNumber}: unable to parse key value pair ${pname}`
                    } as Message);
                }
            }
        }
    }
    return items;
}

const createNewItemValue = (a: Attribute, csvValueFormat: string) => {
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
        case 'weight': {
            const s: string[] = csvValueFormat.split('|');
            setItemWeightValue(a, val, Number(s[0]), s[1] as WeightUnits);
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
};


interface BufferInfo {
    fileName: string;  // eg. file name of a csv or zip file
    entryName: string; // eg. the path name in a zip file, else falsy
    content: Buffer;   // the actual content
}
