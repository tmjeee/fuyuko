import {Item, TableItem} from '../model/item.model';

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

export function toTableItem(items: Item[]): TableItem[] {
  return internalToTableItem(items, -1);
}

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


// danger: without all of the TableItem[], Item[] returned will be incomplete
export function toItem(tableItems: TableItem[]): Item[] {
  const m: Map<number, Item> = tableItems.reduce((acc: Map<number, Item>, tableItem: TableItem) => {
    const itemId = tableItem.id;
    const itemParentId = tableItem.parentId;
    const item: Item = {id: itemId, name: tableItem.name, description: tableItem.description,
      images: tableItem.images, parentId: itemParentId, children: []} as Item;

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
