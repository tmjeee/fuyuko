import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
    TableItem, Item, ItemSearchType
} from '../../model/item.model';
import {toItem, toItemIgnoreParent} from '../../utils/item-to-table-items.util';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/api-response.model';
import {map} from "rxjs/operators";


const URL_GET_ITEMS = () => `${config().api_host_url}/view/:viewId/items/:itemIds`;
const URL_GET_ALL_ITEMS = () => `${config().api_host_url}/view/:viewId/items`;
const URL_GET_SEARCH_FOR_ITEMS = () => `${config().api_host_url}/view/:viewId/searchType/:searchType/search/:search`;
const URL_UPDATE_ITEMS = () => `${config().api_host_url}/view/:viewId/items/update`;
const URL_UPDATE_ITEM_STATUS = () => `${config().api_host_url}/view/:viewId/items/status/:status`;

const URL_DELETE_ITEM_IMAGE = () => `${config().api_host_url}/item/:itemId/image/:itemImageId`;
const URL_MARK_ITEM_IMAGE_AS_PRIMARY = () => `${config().api_host_url}/item/:itemId/image/:itemImageId/mark-primary`;
const URL_UPLOAD_ITEM_IMAGE = () => `${config().api_host_url}/item/:itemId/image`;

@Injectable()
export class ItemService {

  constructor(private httpClient: HttpClient) {}


  getAllItems(viewId: number): Observable<Item[]> {
      return this.httpClient
          .get<ApiResponse<Item[]>>(URL_GET_ALL_ITEMS().replace(':viewId', String(viewId)))
          .pipe(
              map((r: ApiResponse<Item[]>) => r.payload)
          );
  }

  searchForItems(viewId: number, searchType: ItemSearchType = 'basic', search: string = ''): Observable<Item[]> {
    return this.httpClient.get<ApiResponse<Item[]>>(
        URL_GET_SEARCH_FOR_ITEMS()
            .replace(':viewId', String(viewId))
            .replace(':searchType', searchType)
            .replace(':search', search))
        .pipe(
            map((r: ApiResponse<Item[]>) => r.payload)
        );
  }

  saveItems(viewId: number, items: Item[]): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace(':viewId', String(viewId)), {
      items
    });
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


  getItemsById(viewId: number, itemIds: number[]): Observable<Item[]> {
    return this.httpClient.get<ApiResponse<Item[]>>(
        URL_GET_ITEMS()
            .replace(':viewId', String(viewId))
            .replace(':itemIds',
                itemIds
                    .filter((i: number) => i) // no nulls, undefined or zeros
                    .filter((i: number, index: number, self: number[]) => self.indexOf(i) === index) // unique ones only
                    .join(',')
            ))
        .pipe(
            map((r: ApiResponse<Item[]>) => r.payload)
        );
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
}
