import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    TableItem, Item, ItemSearchType
} from '../../model/item.model';
import {toItem, toItemIgnoreParent} from '../../utils/item-to-table-items.util';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, PaginableApiResponse} from '../../model/api-response.model';
import {DEFAULT_LIMIT, DEFAULT_OFFSET, LimitOffset} from "../../model/limit-offset.model";
import {toQuery} from "../../utils/pagination.utils";
import {map} from "rxjs/operators";


const URL_GET_ITEMS = (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/items/:itemIds?${toQuery(limitOffset)}`;
const URL_GET_ALL_ITEMS = (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/items?${toQuery(limitOffset)}`;
const URL_GET_SEARCH_FOR_ITEMS = (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/searchType/:searchType/search/:search?${toQuery(limitOffset)}`;
const URL_UPDATE_ITEMS = () => `${config().api_host_url}/view/:viewId/items/update`;
const URL_UPDATE_ITEM_STATUS = () => `${config().api_host_url}/view/:viewId/items/status/:status`;

const URL_DELETE_ITEM_IMAGE = () => `${config().api_host_url}/item/:itemId/image/:itemImageId`;
const URL_MARK_ITEM_IMAGE_AS_PRIMARY = () => `${config().api_host_url}/item/:itemId/image/:itemImageId/mark-primary`;
const URL_UPLOAD_ITEM_IMAGE = () => `${config().api_host_url}/item/:itemId/image`;

const URL_GET_FAVOURITE_ITEM_IDS = () => `${config().api_host_url}/view/:viewId/user/:userId/favourite-item-ids`;
const URL_GET_FAVOURITE_ITEMS = (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/user/:userId/favourite-items?${toQuery(limitOffset)}`;
const URL_GET_SEARCH_FOR_FAVOURITE_ITEMS = (limitOffset?: LimitOffset) => `${config().api_host_url}/view/:viewId/user/:userId/searchType/:searchType/search/:search?${toQuery(limitOffset)}`;
const URL_POST_ADD_FAVOURITE_ITEMS = () => `${config().api_host_url}/view/:viewId/user/:userId/add-favourite-items`;
const URL_DELETE_FAVOURITE_ITEMS = () => `${config().api_host_url}/view/:viewId/user/:userId/remove-favourite-items`;

@Injectable()
export class ItemService {

  constructor(private httpClient: HttpClient) {}


  getAllItems(viewId: number, limitOffset?: LimitOffset): Observable<PaginableApiResponse<Item[]>> {
      return this.httpClient
          .get<PaginableApiResponse<Item[]>>(URL_GET_ALL_ITEMS(limitOffset).replace(':viewId', String(viewId)));
  }

  searchForItems(viewId: number, searchType: ItemSearchType = 'basic', search: string = '', limitOffset?: LimitOffset): Observable<PaginableApiResponse<Item[]>> {
    return this.httpClient.get<PaginableApiResponse<Item[]>>(
        URL_GET_SEARCH_FOR_ITEMS(limitOffset)
            .replace(':viewId', String(viewId))
            .replace(':searchType', searchType)
            .replace(':search', search));
  }


  deleteItems(viewId: number, items: Item[]): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_UPDATE_ITEM_STATUS()
              .replace(':viewId', String(viewId))
              .replace(':status', 'DELETED'),
          {
                    itemIds: items.map((i: Item) => i.id)
                }
      );
  }


  saveItems(viewId: number, items: Item[]): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace(':viewId', String(viewId)), {
          items
      });
  }

  saveTableItems(viewId: number, tableItems: TableItem[]): Observable<ApiResponse> {
    const items: Item[] = toItem(tableItems);
    return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace(':viewId', String(viewId)), {
      items
    });
  }


  deleteTableItems(viewId: number, tableItems: TableItem[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(
        URL_UPDATE_ITEM_STATUS()
            .replace(':viewId', String(viewId))
            .replace(':status', 'DELETED'),
        {
                itemIds: tableItems.map((i: TableItem) => i.id)
              });
    const deletedItems: Item[] = [];
  }


  getItemsByIds(viewId: number, itemIds: number[], limitOffset?: LimitOffset): Observable<PaginableApiResponse<Item[]>> {
    if(!!!itemIds || !itemIds.length) { // no item ids
        return of({
            message: 'Success',
            status: 'SUCCESS',
            total: 0,
            limit: limitOffset ? limitOffset.limit : DEFAULT_LIMIT,
            offset: limitOffset ? limitOffset.offset : DEFAULT_OFFSET,
            payload: []
        } as PaginableApiResponse<Item[]>);
    }
    return this.httpClient.get<PaginableApiResponse<Item[]>>(
        URL_GET_ITEMS(limitOffset)
            .replace(':viewId', String(viewId))
            .replace(':itemIds',
                itemIds
                    .filter((i: number) => i) // no nulls, undefined or zeros
                    .filter((i: number, index: number, self: number[]) => self.indexOf(i) === index) // unique ones only
                    .join(',')
            ));
  }

  deleteItemImage(itemId: any, itemImageId: number): Observable<ApiResponse> {
      return this.httpClient.delete<ApiResponse>(URL_DELETE_ITEM_IMAGE()
          .replace(`:itemId`, String(itemId))
          .replace(`:itemImageId`, String(itemImageId)));
  }

  markItemImageAsPrimary(itemId: number, itemImageId: number): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(URL_MARK_ITEM_IMAGE_AS_PRIMARY()
          .replace(`:itemId`, String(itemId))
          .replace(`:itemImageId`, String(itemImageId)), {});
  }

  uploadItemImage(itemId: number, file: File): Observable<ApiResponse> {
      const formData: FormData = new FormData();
      formData.set(`upload1`, file);
      return this.httpClient.post<ApiResponse>(URL_UPLOAD_ITEM_IMAGE()
          .replace(`:itemId`, String(itemId)), formData);
  }

  getFavouriteItemIds(viewId: number, userId: number): Observable<number[]>  {
      return this.httpClient.get<ApiResponse<number[]>>(URL_GET_FAVOURITE_ITEM_IDS()
          .replace(':viewId', String(viewId))
          .replace(':userId', String(userId)))
          .pipe(
            map((r: ApiResponse<number[]>) => r.payload)
          );
  }

  searchForFavouriteItems(viewId: number, userId: number, searchType: ItemSearchType = 'basic', search: string = '', limitOffset?: LimitOffset): Observable<PaginableApiResponse<Item[]>> {
      return this.httpClient.get<PaginableApiResponse<Item[]>>(
          URL_GET_SEARCH_FOR_FAVOURITE_ITEMS(limitOffset)
              .replace(':viewId', String(viewId))
              .replace(':userId', String(userId))
              .replace(':searchType', searchType)
              .replace(':search', search));
  }

  getFavouriteItems(viewId: number, userId: number, limitOffset?: LimitOffset): Observable<PaginableApiResponse<Item[]>> {
      return this.httpClient.get<PaginableApiResponse<Item[]>>(URL_GET_FAVOURITE_ITEMS(limitOffset)
          .replace(':viewId', String(viewId))
          .replace(':userId', String(userId)));
  }

  addFavouriteItems(viewId: number, userId: number, itemIds: number[]): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_POST_ADD_FAVOURITE_ITEMS()
            .replace(':viewId', String(viewId))
            .replace(':userId', String(userId)),
          {itemIds});
  }

  removeFavouriteItems(viewId: number, userId: number, itemIds: number[]): Observable<ApiResponse> {
      return this.httpClient.request<ApiResponse>(
          'DELETE',
          URL_DELETE_FAVOURITE_ITEMS()
              .replace(':viewId', String(viewId))
              .replace(':userId', String(userId)),
          {body: {itemIds}}
          );
  }
}
