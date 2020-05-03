import {Category} from "../model/category.model";
import {Item} from "../model/item.model";
import {LimitOffset} from "../model/limit-offset.model";


export const addOrUpdateCategory = async (viewId: number, c:{id: number, name: string, description: string}): Promise<string[]> => {
    return null;
};

export const getViewCategories = async (viewId: number): Promise<Category[]> => {
    return null;
};

export const getViewCategoryItemsCount = async (viewId: number, categoryId: number): Promise<number> => {
    return null;
};

export const getViewCategoryItems = async (viewId: number, categoryId: number, limitOffset?: LimitOffset): Promise<Item[]> => {
    return null
};

export const addItemToViewCateogry = async (categoryId: number, itemId: number): Promise<string[]> => {
    return null;
};

export const removeItemFromViewCategory = async (cateogryId: number, itemId: number): Promise<string[]> => {
   return null;
};

