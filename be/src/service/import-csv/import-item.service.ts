import {ItemDataImport, PriceDataImport} from "../../model/data-import.model";
import {CsvItem, CsvPrice} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {Item} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";

export const preview = async (viewId: number, itemDataImportId: number, content: Buffer): Promise<ItemDataImport> => {

    const csvPrices: CsvItem[]  = await readCsv<CsvItem>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = [];
    const items: Item[] = await Promise.all(csvPrices.map(async (c: CsvItem) => {

        return null;
    }));

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
