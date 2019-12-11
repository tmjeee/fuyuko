import {PoolConnection} from "mariadb";
import {ItemValueOperatorAndAttribute} from "../model/item-attribute.model";
import {PricedItem2} from "../route/model/server-side.model";
import {Attribute} from "../model/attribute.model";

export const getPricedItem2WithFiltering = async (conn: PoolConnection,
                                            viewId: number,
                                            parentItemId: number,
                                            whenClauses: ItemValueOperatorAndAttribute[]):
    Promise<{b: PricedItem2[], m: Map<string /* attributeId */, Attribute>}> => {
    return null;
}
