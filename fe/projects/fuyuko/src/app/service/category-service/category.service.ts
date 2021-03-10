import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CategorySimpleItem, CategoryWithItems} from '@fuyuko-common/model/category.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {combineAll, map, reduce, tap} from 'rxjs/operators';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toQuery} from '../../utils/pagination.utils';

const URL_GET_CATEGORIES_WITH_ITEMS = () => `${config().api_host_url}/view/:viewId/categories-with-items`;
const URL_GET_CATEGORY_ITEMS_IN_CATEGORY =  (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/category/:categoryId/category-simple-items-in-category?${toQuery(limitOffset)}`;
const URL_GET_CATEGORY_ITEMS_NOT_IN_CATEGORY =  (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/category/:categoryId/category-simple-items-not-in-category?${toQuery(limitOffset)}`;
const URL_POST_ADD_CATEGORY = () => `${config().api_host_url}/view/:viewId/add-category`;
const URL_DELETE_CATEGORY = () => `${config().api_host_url}/view/:viewId/category/:categoryId`;
const URL_POST_UPDATE_CATEGORY = () => `${config().api_host_url}/view/:viewId/update-category`;
const URL_POST_ADD_ITEM_TO_CATEGORY = () => `${config().api_host_url}/view/:viewId/category/:categoryId/item/:itemId`;
const URL_POST_REMOVE_ITEM_FROM_CATEGORY = () => `${config().api_host_url}/view/:viewId/category/:categoryId/item/:itemId`;
const URL_POST_UPDATE_CATEGORY_HIERARCHY = () => `${config().api_host_url}/view/:viewId/category/:categoryId/parentId/:parentId/update-hierarchy`;


@Injectable()
export class CategoryService {

    constructor(private httpClient: HttpClient) { }

    updateCategoryHierarchy(viewId: number, categoryId: number, parentId: number = null): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_POST_UPDATE_CATEGORY_HIERARCHY()
                .replace(':viewId', String(viewId))
                .replace(':categoryId', String(categoryId))
                .replace(':parentId', parentId ? String(parentId) : 'null'), {}
        );
    }

    getCategoriesWithItems(viewId: number): Observable<CategoryWithItems[]> {
        return this.httpClient.get<ApiResponse<CategoryWithItems[]>>(
            URL_GET_CATEGORIES_WITH_ITEMS().replace(':viewId', String(viewId)))
            .pipe(
                map((r: ApiResponse<CategoryWithItems[]>) => {
                    return r.payload;
                })
            );
    }

    getCategorySimpleItemsInCategory(viewId: number, categoryId: number, limitOffset?: LimitOffset):
        Observable<PaginableApiResponse<CategorySimpleItem[]>> {
        return this.httpClient.get<PaginableApiResponse<CategorySimpleItem[]>>(
            URL_GET_CATEGORY_ITEMS_IN_CATEGORY(limitOffset)
                .replace(':viewId', String(viewId))
                .replace(':categoryId', String(categoryId)));
    }

    getCategorySimpleItemsNotInCategory(viewId: number, categoryId: number, limitOffset?: LimitOffset):
        Observable<PaginableApiResponse<CategorySimpleItem[]>> {
        return this.httpClient.get<PaginableApiResponse<CategorySimpleItem[]>>(
            URL_GET_CATEGORY_ITEMS_NOT_IN_CATEGORY(limitOffset)
                .replace(':viewId', String(viewId))
                .replace(':categoryId', String(categoryId)));
    }

    addCategory(viewId: number, parentCategoryId: number, name: string, description: string): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_POST_ADD_CATEGORY()
                .replace(':viewId', String(viewId)), {
                name,
                description,
                parentId: parentCategoryId
            });
    }

    deleteCategory(viewId: number, categoryId: number): Observable<ApiResponse> {
        return this.httpClient.delete<ApiResponse>(
            URL_DELETE_CATEGORY()
                .replace(':viewId', String(viewId))
                .replace(':categoryId', String(categoryId)));
    }

    updateCategory(viewId: number, parentCategoryId: number, categoryId: number, name: string, description: string):
        Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_POST_UPDATE_CATEGORY()
                .replace(':viewId', String(viewId)), {
                id: categoryId,
                parentId: null,
                name, description
            });
    }

    addItemsToCategory(viewId: number, categoryId: number, items: CategorySimpleItem[]): Observable<ApiResponse> {
        const q: Observable<ApiResponse>[] = items.map((i: CategorySimpleItem) =>
            this.httpClient.post<ApiResponse>(URL_POST_ADD_ITEM_TO_CATEGORY()
                .replace(':viewId', String(viewId))
                .replace(':categoryId', String(categoryId))
                .replace(':itemId', String(i.id)), {}));
        return of(...q).pipe(
            combineAll(),
            reduce((a: ApiResponse, i: ApiResponse[]) => {
                for (const b of i) {
                    if (b.status !== 'SUCCESS') {
                        a.status = a.status !== 'ERROR' ? b.status : a.status;
                        a.message = a.message + ', ' + b.message;
                    }
                }
                return a;
            }, {
                status: 'SUCCESS',
                message: 'success'
            } as ApiResponse)
        );
    }

    removeItemsFromCategory(viewId: number, categoryId: number, items: CategorySimpleItem[]): Observable<ApiResponse> {
        const q: Observable<ApiResponse>[] = items.map((i: CategorySimpleItem) =>
            this.httpClient.delete<ApiResponse>(URL_POST_REMOVE_ITEM_FROM_CATEGORY()
                .replace(':viewId', String(viewId))
                .replace(':categoryId', String(categoryId))
                .replace(':itemId', String(i.id))));
        return of(...q).pipe(
            combineAll(),
            reduce((a: ApiResponse, i: ApiResponse[]) => {
                for (const b of i) {
                    if (b.status !== 'SUCCESS') {
                        a.status = a.status !== 'ERROR' ? b.status : a.status;
                        a.message = a.message + ', ' + b.message;
                    }
                }
                return a;
            }, {
                status: 'SUCCESS',
                message: 'success'
            } as ApiResponse)
        );
    }
}
