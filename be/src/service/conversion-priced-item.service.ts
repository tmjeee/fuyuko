import {ItemValue2, PricedItem2} from '../server-side-model/server-side.model';
import {PricedItem, Value} from '@fuyuko-common/model/item.model';
import {itemValueConvert, itemValueRevert} from './conversion-item-value.service';
import {setItemValue} from "@fuyuko-common/shared-utils/item.util";

class ConversionPricedItemService {

    /**
     *  ==========================
     *  === pricedItemsConvert ===
     *  ==========================
     */
    pricedItemsConvert(p: PricedItem2[]): PricedItem[] {
        return p.map(pricedItemConvert);
    }
    pricedItemConvert(p2: PricedItem2): PricedItem {
        const p: PricedItem = {
            id: p2.id,
            name: p2.name,
            description: p2.description,
            parentId: p2.parentId,
            images: p2.images,
            country: p2.country,
            price: p2.price,
            creationDate: p2.creationDate,
            lastUpdate: p2.lastUpdate,
            children: pricedItemsConvert(p2.children),
            values: []
        };
        p2.values.reduce((p: PricedItem, i: ItemValue2) => {
            const value = itemValueConvert(i);
            if (value) {
                p.values.push(value);
            }
            // p[i.attributeId] = itemValueConvert(i);
            return p;
        }, p);
        return p;
    }


    /**
     * =================================
     * === pricedItemsRevert ===
     * =================================
     */
    pricedItemsRevert(items: PricedItem[]): PricedItem2[] {
        return (items ? (items as []).map(pricedItemRevert) : []);
    }
    pricedItemRevert(item: PricedItem): PricedItem2 {
        const item2: PricedItem2 = {
            id: item.id,
            name: item.name,
            description: item.description,
            images: item.images,
            parentId: item.parentId,
            creationDate: item.creationDate,
            lastUpdate: item.lastUpdate,
            values: [],
            children: pricedItemsRevert(item.children),
            price: (item as PricedItem).price ? (item as PricedItem).price : undefined,
            country: (item as PricedItem).country ? (item as PricedItem).country : undefined
        } as PricedItem2;

        for (const value of item.values) {
            const val2: ItemValue2 | undefined = itemValueRevert(value);
            if (val2) {
                item2.values.push(val2);
            }
        }

        // for (const i in item) {
        //     if (item.hasOwnProperty(i) && !isNaN(Number(i))) {
        //         const value: Value = item[i];
        //         const val2: ItemValue2 | undefined = itemValueRevert(value);
        //         if (val2) {
        //             item2.values.push(val2);
        //         }
        //     }
        // }
        return item2;
    }
}

const s = new ConversionPricedItemService()
export const
    pricedItemsConvert = s.pricedItemsConvert.bind(s),
    pricedItemConvert = s.pricedItemConvert.bind(s),
    pricedItemsRevert = s.pricedItemsRevert.bind(s),
    pricedItemRevert = s.pricedItemRevert.bind(s);
