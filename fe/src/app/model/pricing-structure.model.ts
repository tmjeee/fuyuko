

export interface PricingStructure {
    id: number;
    name: string;
    description: string;
}

export interface PricingStructureWithItems {
    id: number;
    name: string;
    description: string;
    items: PricingStructureItemWithPrice[];
}

export interface PricingStructureItem {
    id: number;
    itemId: number;
    itemName: string;
    itemDescription: string;
}

export interface PricingStructureItemWithPrice {
    id: number;
    itemId: number;
    itemName: string;
    itemDescription: string;
    price: number;
    country: string;

    parentId: number;
    children: PricingStructureItemWithPrice[];
}

export interface TablePricingStructureItemWithPrice {
    id: number;
    itemId: number;
    itemName: string;
    itemDescription: string;
    price: number;
    country: string;

    depth: number;
    parentId: number;
    rootParentId: number;
}


