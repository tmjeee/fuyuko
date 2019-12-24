import {Injectable} from '@angular/core';
import {forkJoin, merge, Observable, of, Subject} from 'rxjs';
import {
  TableItem, Item
} from '../../model/item.model';
import {SearchType} from '../../component/item-search-component/item-search.component';
import {copyAttrProperties, toItem} from '../../utils/item-to-table-items.util';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/response.model';


const URL_GET_ALL_ITEMS = () => `${config().api_host_url}/view/:viewId/items`;
const URL_UPDATE_ITEMS = () => `${config().api_host_url}/view/:viewId/items/update`;
const URL_UPDATE_ITEM_STATUS = () => `${config().api_host_url}/view/:viewId/items/status/:status`;


@Injectable()
export class ItemService {

  constructor(private httpClient: HttpClient) {}


  getAllItems(viewId: number, search: string = '', searchType: SearchType = 'basic'): Observable<Item[]> {
    if (search) {
        // todo: need one REST api for search
      return this.httpClient.get<Item[]>(URL_GET_ALL_ITEMS().replace(':viewId', String(viewId)));
    } else {
      return this.httpClient.get<Item[]>(URL_GET_ALL_ITEMS().replace(':viewId', String(viewId)));
    }
  }

  saveItems(viewId: number, items: Item[]): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace('viewId', String(viewId)), {
      items
    });
  }

  deleteItems(viewId: number, items: Item[]): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_UPDATE_ITEM_STATUS().replace(':viewId', String(viewId)).replace(':status', 'DELETED'),{
            itemIds: items.map((i: Item) => i.id)
          });
  }

  saveTableItems(viewId: number, tableItems: TableItem[]): Observable<ApiResponse> {
    const items: Item[] = toItem(tableItems);
    return this.httpClient.post<ApiResponse>(URL_UPDATE_ITEMS().replace(':viewId', String(viewId)), {
      items
    });
  }


  deleteTableItems(viewId: number, tableItems: TableItem[]): Observable<ApiResponse> {
    const items: Item[] = toItem(tableItems);
    return this.httpClient.post<ApiResponse>(
        URL_UPDATE_ITEM_STATUS().replace(':viewId', String(viewId)).replace(':status', 'DELETED'),{
          itemIds: items.map((i: Item) => i.id)
        });
    const deletedItems: Item[] = [];
  }
}
