////// common
export function copyAttrProperties(from, to) {
    for (const attId in from) {
        if (from.hasOwnProperty(attId)) {
            const r = parseInt(attId, 10);
            if (!Number.isNaN(r)) {
                to[attId] = Object.assign({}, from[attId]);
            }
        }
    }
}
////////  item <-> tableItem
function internalToTableItem(items, depth, rootParentId) {
    const nextDepth = ++depth;
    return items.reduce((tableItems, item) => {
        const childrenRootParentId = (rootParentId ? rootParentId : item.id);
        // item itself
        const tableItem = {
            id: item.id,
            depth,
            name: item.name,
            description: item.description,
            images: item.images,
            rootParentId,
            parentId: item.parentId,
        };
        copyAttrProperties(item, tableItem);
        tableItems.push(tableItem);
        // children of item
        const childrenTableItems = internalToTableItem(item.children, nextDepth, childrenRootParentId);
        tableItems.push(...childrenTableItems);
        return tableItems;
    }, []);
}
export function toTableItem(items) {
    return internalToTableItem(items, -1);
}
// danger: without all of the TableItem[], Item[] returned will be incomplete
export function toItem(tableItems) {
    const m = tableItems.reduce((acc, tableItem) => {
        const itemId = tableItem.id;
        const itemParentId = tableItem.parentId;
        const item = {
            id: itemId,
            name: tableItem.name,
            description: tableItem.description,
            images: tableItem.images,
            parentId: itemParentId,
            children: []
        };
        // item
        if (!acc.has(itemId)) {
            copyAttrProperties(tableItem, item);
            acc.set(itemId, item);
        }
        else {
            const i = acc.get(itemId);
            i.images = tableItem.images;
            i.name = tableItem.name;
            i.description = tableItem.description;
            copyAttrProperties(tableItem, i);
        }
        // item's parent
        if (itemParentId) {
            if (!acc.has(itemParentId)) {
                const pi = { id: itemParentId, parentId: undefined, children: [item] };
                acc.set(itemParentId, pi);
            }
            else {
                const itemParent = acc.get(itemParentId);
                const itemIndexInExistingParent = itemParent.children.findIndex((i) => i.id === item.id);
                if (itemIndexInExistingParent === -1) { // doens't exists yet
                    itemParent.children.push(item);
                }
            }
        }
        return acc;
    }, new Map());
    return Array.from(m.values()).filter((i) => !!!i.parentId);
}
//////////////// bulkEditItem <-> tableBulkEditItem
function internalToBulkEditTableItem(items, depth, rootParentId) {
    const nextDepth = ++depth;
    return items.reduce((tableItems, item) => {
        const childrenRootParentId = (rootParentId ? rootParentId : item.id);
        // item itself
        const tableItem = {
            id: item.id,
            depth,
            name: item.name,
            description: item.description,
            images: item.images,
            rootParentId,
            parentId: item.parentId,
            whens: item.whens,
            changes: item.changes
        };
        copyAttrProperties(item, tableItem);
        tableItems.push(tableItem);
        // children of item
        const childrenTableItems = internalToBulkEditTableItem(item.children, nextDepth, childrenRootParentId);
        tableItems.push(...childrenTableItems);
        return tableItems;
    }, []);
}
export function toBulkEditTableItem(items) {
    return internalToBulkEditTableItem(items, -1);
}
export function toBulkEditItem(tableItems) {
    const m = tableItems.reduce((acc, tableItem) => {
        const itemId = tableItem.id;
        const itemParentId = tableItem.parentId;
        const item = {
            id: itemId,
            name: tableItem.name,
            description: tableItem.description,
            whens: tableItem.whens,
            changes: tableItem.changes,
            images: tableItem.images,
            parentId: itemParentId,
            children: []
        };
        // item
        if (!acc.has(itemId)) {
            copyAttrProperties(tableItem, item);
            acc.set(itemId, item);
        }
        else {
            const i = acc.get(itemId);
            i.images = tableItem.images;
            i.name = tableItem.name;
            i.whens = tableItem.whens;
            i.changes = tableItem.changes;
            i.description = tableItem.description;
            copyAttrProperties(tableItem, i);
        }
        // item's parent
        if (itemParentId) {
            if (!acc.has(itemParentId)) {
                const pi = { id: itemParentId, parentId: undefined, children: [item] };
                acc.set(itemParentId, pi);
            }
            else {
                const itemParent = acc.get(itemParentId);
                const itemIndexInExistingParent = itemParent.children.findIndex((i) => i.id === item.id);
                if (itemIndexInExistingParent === -1) { // doens't exists yet
                    itemParent.children.push(item);
                }
            }
        }
        return acc;
    }, new Map());
    return Array.from(m.values()).filter((i) => !!!i.parentId);
}
//////// pricingStructureItemWithPrice <-> tablePricingStructureItemWithPrice
function internalToTablePricingStructureItemWithPrice(items, depth, rootParentId) {
    if (!items) {
        return [];
    }
    const nextDepth = ++depth;
    return items.reduce((tableItems, item) => {
        const childrenRootParentId = (rootParentId ? rootParentId : item.id);
        // item itself
        const tableItem = {
            id: item.id,
            itemId: item.itemId,
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            price: item.price,
            country: item.country,
            depth,
            rootParentId,
            parentId: item.parentId,
        };
        copyAttrProperties(item, tableItem);
        tableItems.push(tableItem);
        // children of item
        const childrenTableItems = internalToTablePricingStructureItemWithPrice(item.children, nextDepth, childrenRootParentId);
        tableItems.push(...childrenTableItems);
        return tableItems;
    }, []);
}
export function toTablePricingStructureItemWithPrice(items) {
    return internalToTablePricingStructureItemWithPrice(items, -1);
}
export function toPricingStructureItemWithPrice(tableItems) {
    const m = tableItems.reduce((acc, tableItem) => {
        const itemId = tableItem.id;
        const itemParentId = tableItem.parentId;
        const item = {
            id: itemId,
            itemId: tableItem.itemId,
            itemName: tableItem.itemName,
            itemDescription: tableItem.itemDescription,
            price: tableItem.price,
            country: tableItem.country,
            parentId: itemParentId,
            children: []
        };
        // item
        if (!acc.has(itemId)) {
            copyAttrProperties(tableItem, item);
            acc.set(itemId, item);
        }
        else {
            const i = acc.get(itemId);
            i.itemId = tableItem.itemId;
            i.itemName = tableItem.itemName;
            i.itemDescription = tableItem.itemDescription;
            i.price = tableItem.price;
            i.country = tableItem.country;
            copyAttrProperties(tableItem, i);
        }
        // item's parent
        if (itemParentId) {
            if (!acc.has(itemParentId)) {
                const pi = {
                    id: itemParentId,
                    parentId: undefined,
                    children: [item]
                };
                acc.set(itemParentId, pi);
            }
            else {
                const itemParent = acc.get(itemParentId);
                const itemIndexInExistingParent = itemParent.children.findIndex((i) => i.id === item.id);
                if (itemIndexInExistingParent === -1) { // doens't exists yet
                    itemParent.children.push(item);
                }
            }
        }
        return acc;
    }, new Map());
    return Array.from(m.values()).filter((i) => !!!i.parentId);
}
//# sourceMappingURL=item-to-table-items.util.js.map