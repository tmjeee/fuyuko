import {Attribute} from "../../model/attribute.model";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {getPricedItemsWithFiltering} from "../priced-item-filtering.service";
import {PricedItem} from "../../model/item.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ExportPricePreviewEvent, fireEvent} from "../event/event.service";


/**
 * ================================
 * === preview ===
 * ================================
 */
export type PreviewResult = { i: PricedItem[], m: Map<string /* attributeId */, Attribute>};
export const preview = async (viewId: number, pricingStructureId: number, filter: ItemValueOperatorAndAttribute[]): Promise<PreviewResult> => {
    const {b: items, m: attributesMap}: {b: PricedItem[], m: Map<string /* attributeId */, Attribute> } = await doInDbConnection(async (conn: Connection) => {
        return await getPricedItemsWithFiltering(viewId, pricingStructureId, null, filter);
    });

    const r: PreviewResult = {
       i: items,
       m: attributesMap
    } as PreviewResult;

    fireEvent({
        type: "ExportPricePreviewEvent",
        previewResult: r
    } as ExportPricePreviewEvent);
    
    return r;
}
