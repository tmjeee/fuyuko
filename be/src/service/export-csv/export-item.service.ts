import {Attribute} from "../../model/attribute.model";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {getItem2WithFiltering, Item2WithFilteringResult} from "../item-filtering.service";
import {Item} from "../../model/item.model";
import {convert} from "../conversion-item.service";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";

export type PreviewResult = {i: Item[], m: Map<string /* attributeId */, Attribute>};

export const preview = async (viewId: number, filter: ItemValueOperatorAndAttribute[]): Promise<PreviewResult> => {
    const {b: item2s, m: attributesMap}: Item2WithFilteringResult = await doInDbConnection(async (conn: Connection) => {
        return await getItem2WithFiltering(conn, viewId, null, filter);
    });

    const items: Item[] = convert(item2s);
    return {
        i: items,
        m: attributesMap
    } as PreviewResult;
}
