
export interface PricingStructure {
    id: number; // pricing structure id
    viewId: number;
    name: string;
    description: string;
}

export interface PricingStructureWithItems {
    id: number; // pricing structure id
    viewId: number;
    name: string;
    description: string;
    items: PricingStructureItemWithPrice[];
}

export interface PricingStructureItem {
    id: number;     // pricing structure item id
    itemId: number;
    itemName: string;
    itemDescription: string;
}

export interface PricingStructureItemWithPrice {
    id: number;     // pricing structure item id
    itemId: number;
    itemName: string;
    itemDescription: string;
    price: number;
    country: string;

    parentId: number;
    children: PricingStructureItemWithPrice[];
}

export interface TablePricingStructureItemWithPrice {
    id: number;         // pricing structure item id
    itemId: number;
    itemName: string;
    itemDescription: string;
    price: number;
    country: string;

    depth: number;
    parentId: number;
    rootParentId: number;
}

export interface PriceDataItem {
    pricingStructureId: number;
    pricingStructureName: string;
    item: PricingStructureItemWithPrice;
}

