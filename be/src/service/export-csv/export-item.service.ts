import {Attribute} from "../../model/attribute.model";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {
    getItemWithFiltering,
    ItemWithFilteringResult
} from "../item-filtering.service";
import {Item} from "../../model/item.model";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ExportItemPreviewEvent, fireEvent} from "../event/event.service";

/**
 * =============================
 * === preview ===
 * =============================
 */
export type PreviewResult = {i: Item[], m: Map<string /* attributeId */, Attribute>};
export const preview = async (viewId: number, filter: ItemValueOperatorAndAttribute[]): Promise<PreviewResult> => {
    const {b: items, m: attributesMap}: ItemWithFilteringResult = await doInDbConnection(async (conn: Connection) => {
        return await getItemWithFiltering(viewId, null, filter);
    });

    const r: PreviewResult =  {
        i: items,
        m: attributesMap
    } as PreviewResult;
    
    fireEvent({
        type: "ExportItemPreviewEvent",
        previewResult: r
    } as ExportItemPreviewEvent);
    
    return r;
}
