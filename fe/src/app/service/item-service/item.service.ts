import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
    TableItem, Item, ItemSearchType
} from '../../model/item.model';
import {toItem, toItemIgnoreParent} from '../../utils/item-to-table-items.util';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/response.model';


const URL_GET_ITEMS = () => `${config().api_host_url}/view/:viewId/items/:itemIds`;
const URL_GET_ALL_ITEMS = () => `${config().api_host_url}/view/:viewId/items`;
const URL_GET_SEARCH_FOR_ITEMS = () => `${config().api_host_url}/view/:viewId/searchType/:searchType/search/:search`;
const URL_UPDATE_ITEMS = () => `${config().api_host_url}/view/:viewId/items/update`;
const URL_UPDATE_ITEM_STATUS = () => `${config().api_host_url}/view/:viewId/items/status/:status`;


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
      console.log('************ saveItems', items);
      return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace('viewId', String(viewId)), {
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
    const items: Item[] = toItemIgnoreParent(tableItems);
    console.log('******************* saveTableItems', items);
    return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace(':viewId', String(viewId)), {
      items
    });
  }


  deleteTableItems(viewId: number, tableItems: TableItem[]): Observable<ApiResponse> {
    const items: Item[] = toItem(tableItems);
    return this.httpClient.post<ApiResponse>(
        URL_UPDATE_ITEM_STATUS()
            .replace(':viewId', String(viewId))
            .replace(':status', 'DELETED'),
        {
                itemIds: items.map((i: Item) => i.id)
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
}
