import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
    TableItem, Item, ItemSearchType
} from '../../model/item.model';
import {toItem, toItemIgnoreParent} from '../../utils/item-to-table-items.util';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/api-response.model';


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
      return this.httpClient.get<Item[]>(URL_GET_ALL_ITEMS().replace(':viewId', String(viewId)));
  }

  searchForItems(viewId: number, searchType: ItemSearchType = 'basic', search: string = ''): Observable<Item[]> {
    return this.httpClient.get<Item[]>(
        URL_GET_SEARCH_FOR_ITEMS()
            .replace(':viewId', String(viewId))
            .replace(':searchType', searchType)
            .replace(':search', search));
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
    return this.httpClient.get<Item[]>(
        URL_GET_ITEMS()
            .replace(':viewId', String(viewId))
            .replace(':itemIds',
                itemIds
                    .filter((i: number) => i) // no nulls, undefined or zeros
                    .filter((i: number, index: number, self: number[]) => self.indexOf(i) === index) // unique ones only
                    .join(',')
            ));
  }

  deleteItemImage(itemId: any, itemImageId: number): Observable<boolean> {
      return this.httpClient.delete<boolean>(URL_DELETE_ITEM_IMAGE()
          .replace(`:itemId`, String(itemId))
          .replace(`:itemImageId`, String(itemImageId)));
  }

  markItemImageAsPrimary(itemId: number, itemImageId: number): Observable<boolean> {
      return this.httpClient.post<boolean>(URL_MARK_ITEM_IMAGE_AS_PRIMARY()
          .replace(`:itemId`, String(itemId))
          .replace(`:itemImageId`, String(itemImageId)), {});
  }

  uploadItemImage(itemId: number, file: File): Observable<boolean> {
      console.log('****** item service ', file);
      const formData: FormData = new FormData();
      formData.set(`upload1`, file);
      return this.httpClient.post<boolean>(URL_UPLOAD_ITEM_IMAGE()
          .replace(`:itemId`, String(itemId)), formData);

  }
}
