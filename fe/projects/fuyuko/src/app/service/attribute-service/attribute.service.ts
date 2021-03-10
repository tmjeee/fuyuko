import {Injectable} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {Observable} from 'rxjs';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toQuery} from '../../utils/pagination.utils';

const URL_ALL_ATTRIBUTES_BY_VIEW = (limitOffset: LimitOffset) => `${config().api_host_url}/attributes/view/:viewId?${toQuery(limitOffset)}`;
const URL_ATTRIBUTE_BY_VIEW = () => `${config().api_host_url}/attribute/:attributeId/view/:viewId`;
const URL_SEARCH_ALL_ATTRIBUTES_BY_VIEW = () => `${config().api_host_url}/attributes/view/:viewId/search/:attribute`;
const URL_ADD_ATTRIBUTE_TO_VIEW = () => `${config().api_host_url}/view/:viewId/attributes/add`;
const URL_UPDATE_ATTRIBUTE = () => `${config().api_host_url}/view/:viewId/attributes/update`;
const URL_UPDATE_ATTRIBUTE_STATUS = () => `${config().api_host_url}/view/:viewId/attribute/:attributeId/state/:state`;

@Injectable()
export class AttributeService {

  constructor(private httpClient: HttpClient) {}

  // todo: needs changing
  getAllAttributesByView(viewId: number, limitOffset?: LimitOffset): Observable<PaginableApiResponse<Attribute[]>> {
    return this.httpClient
        .get<PaginableApiResponse<Attribute[]>>(
            URL_ALL_ATTRIBUTES_BY_VIEW(limitOffset).replace(':viewId', String(viewId)));
  }

  getAttributeByView(viewId: number, attributeId: number): Observable<Attribute> {
      return this.httpClient
          .get<ApiResponse<Attribute>>(URL_ATTRIBUTE_BY_VIEW()
              .replace(':viewId', String(viewId)).replace(':attributeId', String(attributeId)))
          .pipe(
              map((r: ApiResponse<Attribute>) => r.payload)
          );
  }

  deleteAttribute(view: View, attribute: Attribute): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_UPDATE_ATTRIBUTE_STATUS()
              .replace(':viewId', String(view.id))
              .replace(':attributeId', String(attribute.id))
              .replace(':state', 'DELETED'), {});
  }

  searchAttribute(viewId: number, search: string): Observable<Attribute[]> {
    return this.httpClient.get<ApiResponse<Attribute[]>>(
        URL_SEARCH_ALL_ATTRIBUTES_BY_VIEW()
            .replace(':viewId', String(viewId))
            .replace(':attribute', search))
        .pipe(
            map((r: ApiResponse<Attribute[]>) => r.payload)
        );
  }

  addAttribute(view: View, attribute: Attribute): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_ADD_ATTRIBUTE_TO_VIEW().replace(':viewId', String(view.id)), {
            attributes: [attribute]
          });
  }

  updateAttribute(view: View, attribute: Attribute): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_UPDATE_ATTRIBUTE()
            .replace(':viewId', String(view.id)), {
                attributes: [attribute]
            });
  }
}

