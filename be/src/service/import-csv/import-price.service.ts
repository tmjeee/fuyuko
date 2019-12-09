import {PriceDataImport} from "../../model/data-import.model";
import {CsvPrice} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {getPricingStructureItem} from "../pricing-structure-item.service";

export const preview = async (viewId: number, attributeDataImportId: number, content: Buffer): Promise<PriceDataImport> => {

    const csvPrices: CsvPrice[]  = await readCsv<CsvPrice>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const items: PricingStructureItemWithPrice[] = await Promise.all(csvPrices.map(async (c: CsvPrice) => {

        const pricingStructureFormat: string = c.pricingStructureFormat ? c.pricingStructureFormat.trim() : c.pricingStructureFormat;
        const itemFormat: string = c.itemFormat ? c.itemFormat.trim() : c.itemFormat;

        let pricingStructureId: number = undefined;
        let itemId: number = undefined;

        if (pricingStructureFormat) {
            const token: string[] = pricingStructureFormat.split('=');
            if (token.length == 2) {
                const identifier: string = token[0];
                const val: string = token[1];
                switch(identifier) {
                    case 'id': // pricing structure id
                        break;
                    case 'name': // pricing structure name
                        break;
                }
            }
        }

        if (itemFormat) {
            const token: string[] = itemFormat.split('=');
            if (token.length == 2) {
                const identifier: string = token[0];
                const val: string = token[1];
                switch(identifier) {
                    case 'id': // item id
                        break;
                    case 'name': // item name
                        break;
                }
            }
        }


        const p: PricingStructureItemWithPrice = await getPricingStructureItem(pricingStructureId, itemId);
        p.price = c.price;
        p.country = c.country;

        return p;
    }));

    return {
        type: 'PRICE',
        messages: {
            infos,
            warnings,
            errors
        } as Messages,
        items
    } as PriceDataImport;
}
