import {Item, ItemImage, PricedItem, TableItem, TablePricedItem, Value} from '../model/item.model';
import {BulkEditItem, BulkEditTableItem} from '../model/bulk-edit.model';
import {
  PricingStructureItemWithPrice,
  TablePricingStructureItemWithPrice
} from '../model/pricing-structure.model';
import {root} from "rxjs/internal-compatibility";

////// common
export function copyAttrProperties(from: any, to: any) {
  for (const attId in from) {
    if (from.hasOwnProperty(attId)) {
      const r = parseInt(attId, 10);
      if (!Number.isNaN(r)) {
        to[attId] = {...from[attId]};
      }
    }
  }
}

////////  item <-> tableItem
function internalToTableItem(items: Item[], depth: number, rootParentId?: number): TableItem[] {
  const nextDepth = ++depth;
  return items.reduce((tableItems: TableItem[], item: Item) => {
    const childrenRootParentId = (rootParentId ? rootParentId : item.id);
    // item itself
    const tableItem: TableItem = {
      id: item.id,
      depth,
      name: item.name,
      description: item.description,
      images: item.images,
      rootParentId,
      parentId: item.parentId,
    } as TableItem;
    copyAttrProperties(item, tableItem);
    tableItems.push(tableItem);

    // children of item
    const childrenTableItems: TableItem[] = internalToTableItem(item.children, nextDepth, childrenRootParentId);
    tableItems.push(...childrenTableItems);

    return tableItems;
  }, []);
}


export function toTableItem(items: Item[]): TableItem[] {
  return internalToTableItem(items, -1);
}

// danger: without all of the TableItem[], Item[] returned will be incomplete
export function toItem(tableItems: TableItem[]): Item[] {
  const m: Map<number, Item> = tableItems.reduce((acc: Map<number, Item>, tableItem: TableItem) => {
    const itemId = tableItem.id;
    const itemParentId = tableItem.parentId;
    const item: Item = {
      id: itemId,
      name: tableItem.name,
      description: tableItem.description,
      images: tableItem.images,
      parentId: itemParentId,
      children: []
    } as Item;

    // item
    if (!acc.has(itemId)) {
      copyAttrProperties(tableItem, item);
      acc.set(itemId, item);
    } else {
      const i: Item = acc.get(itemId);
      i.images = tableItem.images;
      i.name = tableItem.name;
      i.description = tableItem.description;
      copyAttrProperties(tableItem, i);
    }

    // item's parent
    if (itemParentId) {
      if (!acc.has(itemParentId)) {
        const pi: Item = {id: itemParentId, parentId: undefined, children: [item]} as Item;
        acc.set(itemParentId, pi);
      } else {
        const itemParent: Item = acc.get(itemParentId);
        const itemIndexInExistingParent: number = itemParent.children.findIndex((i: Item) => i.id === item.id);
        if (itemIndexInExistingParent === -1) { // doens't exists yet
          itemParent.children.push(item);
        }
      }
    }
    return acc;
  }, new Map());
  return Array.from(m.values()).filter((i: Item) => !!!i.parentId);
}


//////////////// bulkEditItem <-> tableBulkEditItem

function internalToBulkEditTableItem(items: BulkEditItem[], depth: number, rootParentId?: number): BulkEditTableItem[] {
  const nextDepth = ++depth;
  return items.reduce((tableItems: BulkEditTableItem[], item: BulkEditItem) => {
    const childrenRootParentId = (rootParentId ? rootParentId : item.id);
    // item itself
    const tableItem: BulkEditTableItem = {
      id: item.id,
      depth,
      name: item.name,
      description: item.description,
      images: item.images,
      rootParentId,
      parentId: item.parentId,
      whens: item.whens,
      changes: item.changes
    } as BulkEditTableItem;
    copyAttrProperties(item, tableItem);
    tableItems.push(tableItem);

    // children of item
    const childrenTableItems: BulkEditTableItem[] = internalToBulkEditTableItem(item.children, nextDepth, childrenRootParentId);
    tableItems.push(...childrenTableItems);

    return tableItems;
  }, []);
}

export function toBulkEditTableItem(items: BulkEditItem[]): BulkEditTableItem[] {
    return internalToBulkEditTableItem(items, -1);
}

export function toBulkEditItem(tableItems: BulkEditTableItem[]): BulkEditItem[] {
  const m: Map<number, BulkEditItem> = tableItems.reduce((acc: Map<number, BulkEditItem>, tableItem: BulkEditTableItem) => {
    const itemId = tableItem.id;
    const itemParentId = tableItem.parentId;
    const item: BulkEditItem = {
      id: itemId,
      name: tableItem.name,
      description: tableItem.description,
      whens: tableItem.whens,
      changes: tableItem.changes,
      images: tableItem.images,
      parentId: itemParentId,
      children: []
    } as BulkEditItem;

    // item
    if (!acc.has(itemId)) {
      copyAttrProperties(tableItem, item);
      acc.set(itemId, item);
    } else {
      const i: BulkEditItem = acc.get(itemId);
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
        const pi: BulkEditItem = {id: itemParentId, parentId: undefined, children: [item]} as BulkEditItem;
        acc.set(itemParentId, pi);
      } else {
        const itemParent: BulkEditItem = acc.get(itemParentId);
        const itemIndexInExistingParent: number = itemParent.children.findIndex((i: BulkEditItem) => i.id === item.id);
        if (itemIndexInExistingParent === -1) { // doens't exists yet
          itemParent.children.push(item);
        }
      }
    }
    return acc;
  }, new Map());
  return Array.from(m.values()).filter((i: BulkEditItem) => !!!i.parentId);
}


///////// pricedItem <-> tablePricedItem
function internalToTablePricedItem(items: PricedItem[], depth: number, rootParentId?: number): TablePricedItem[] {
    if (!items) {
      return [];
    }
    const nextDepth = ++depth;
    return items.reduce((tableItems: TablePricedItem[], item: PricedItem) => {
      const childrenRootParentId = (rootParentId ? rootParentId : item.id);

      // item itsef
      const tableItem: TablePricedItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        parentId: item.parentId,
        depth,
        rootParentId,
        price: item.price,
        country: item.country,
      } as TablePricedItem;
      copyAttrProperties(item, tableItem);
      tableItems.push(tableItem);

      // children of item
      const childrenTableItems: TablePricedItem[] =
          internalToTablePricedItem(item.children, nextDepth, childrenRootParentId);
      tableItems.push(...childrenTableItems);

      return tableItems;
    }, []);
}

export function toTablePricedItem(items: PricedItem[]): TablePricedItem[] {
  return internalToTablePricedItem(items, -1);
}

export function toPricedItem(tableItems: TablePricedItem[]): PricedItem[] {
  const m: Map<number, PricedItem> =
      tableItems.reduce((acc: Map<number, PricedItem>, tableItem: TablePricedItem) => {
        const itemId = tableItem.id;
        const itemParentId = tableItem.parentId;
        const item: PricedItem = {
          id: itemId,
          name: tableItem.name,
          description: tableItem.description,
          images: tableItem.images,
          parentId: tableItem.parentId,
          price: tableItem.price,
          country: tableItem.country,
          children: []
        } as PricedItem;

        // item
        if (!acc.has(itemId)) {
          copyAttrProperties(tableItem, item);
          acc.set(itemId, item);
        } else {
          const i: PricedItem = acc.get(itemId);
          i.id = itemId;
          i.name = tableItem.name;
          i.description = tableItem.description;
          i.images = tableItem.images;
          i.price = tableItem.price;
          i.country = tableItem.country;
          copyAttrProperties(tableItem, i);
        }

        // item's parent
        if (itemParentId) {
          if (!acc.has(itemParentId)) {
            const pi: PricedItem = {
              id: itemParentId,
              parentId: undefined,
              children: [item]
            } as PricedItem;
            acc.set(itemParentId, pi);
          } else {
            const itemParent: PricedItem = acc.get(itemParentId);
            const itemIndexInExistingParent: number = itemParent.children.findIndex((i: PricedItem) => i.id === item.id);
            if (itemIndexInExistingParent === -1) { // doens't exists yet
              itemParent.children.push(item);
            }
          }
        }
        return acc;
      }, new Map());
  return Array.from(m.values()).filter((i: PricedItem) => !!!i.parentId);
}


//////// pricingStructureItemWithPrice <-> tablePricingStructureItemWithPrice

function internalToTablePricingStructureItemWithPrice(items: PricingStructureItemWithPrice[], depth: number, rootParentId?: number):
    TablePricingStructureItemWithPrice[] {
  if (!items) {
     return [];
  }
  const nextDepth = ++depth;
  return items.reduce((tableItems: TablePricingStructureItemWithPrice[], item: PricingStructureItemWithPrice) => {
    const childrenRootParentId = (rootParentId ? rootParentId : item.id);
    // item itself
    const tableItem: TablePricingStructureItemWithPrice = {
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      price: item.price,
      country: item.country,
      depth,
      rootParentId,
      parentId: item.parentId,
    } as TablePricingStructureItemWithPrice;
    copyAttrProperties(item, tableItem);
    tableItems.push(tableItem);

    // children of item
    const childrenTableItems: TablePricingStructureItemWithPrice[] =
        internalToTablePricingStructureItemWithPrice(item.children, nextDepth, childrenRootParentId);
    tableItems.push(...childrenTableItems);

    return tableItems;
  }, []);
}

export function toTablePricingStructureItemWithPrice(items: PricingStructureItemWithPrice[]): TablePricingStructureItemWithPrice[] {
    return internalToTablePricingStructureItemWithPrice(items, -1);
}

export function toPricingStructureItemWithPrice(tableItems: TablePricingStructureItemWithPrice[]): PricingStructureItemWithPrice[] {
  const m: Map<number, PricingStructureItemWithPrice> =
      tableItems.reduce((acc: Map<number, PricingStructureItemWithPrice>, tableItem: TablePricingStructureItemWithPrice) => {
    const itemId = tableItem.id;
    const itemParentId = tableItem.parentId;
    const item: PricingStructureItemWithPrice = {
      id: itemId,
      itemId: tableItem.itemId,
      itemName: tableItem.itemName,
      itemDescription: tableItem.itemDescription,
      price: tableItem.price,
      country: tableItem.country,
      parentId: itemParentId,
      children: []
    } as PricingStructureItemWithPrice;

    // item
    if (!acc.has(itemId)) {
      copyAttrProperties(tableItem, item);
      acc.set(itemId, item);
    } else {
      const i: PricingStructureItemWithPrice = acc.get(itemId);
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
        const pi: PricingStructureItemWithPrice = {
          id: itemParentId,
          parentId: undefined,
          children: [item]
        } as PricingStructureItemWithPrice;
        acc.set(itemParentId, pi);
      } else {
        const itemParent: PricingStructureItemWithPrice = acc.get(itemParentId);
        const itemIndexInExistingParent: number = itemParent.children.findIndex((i: PricingStructureItemWithPrice) => i.id === item.id);
        if (itemIndexInExistingParent === -1) { // doens't exists yet
          itemParent.children.push(item);
        }
      }
    }
    return acc;
  }, new Map());
  return Array.from(m.values()).filter((i: PricingStructureItemWithPrice) => !!!i.parentId);
}
