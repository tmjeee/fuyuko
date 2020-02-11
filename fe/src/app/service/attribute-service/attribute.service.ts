import {Injectable} from '@angular/core';
import {View} from '../../model/view.model';
import {Observable, of} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {HttpClient} from '@angular/common/http';
import config from '../../utils/config.util';
import {ApiResponse} from '../../model/response.model';

const URL_ALL_ATTRIBUTES_BY_VIEW = () => `${config().api_host_url}/attributes/view/:viewId`;
const URL_ATTRIBUTE_BY_VIEW = () => `${config().api_host_url}/attribute/:attributeId/view/:viewId`;
const URL_SEARCH_ALL_ATTRIBUTES_BY_VIEW = () => `${config().api_host_url}/attributes/view/:viewId/search/:attribute`;
const URL_ADD_ATTRIBUTE_TO_VIEW = () => `${config().api_host_url}/view/:viewId/attributes/add`;
const URL_UPDATE_ATTRIBUTE = () => `${config().api_host_url}/attributes/update`;
const URL_UPDATE_ATTRIBUTE_STATUS = () => `${config().api_host_url}/attribute/:attributeId/state/:state`;

@Injectable()
export class AttributeService {

  constructor(private httpClient: HttpClient) {}

  getAllAttributesByView(viewId: number): Observable<Attribute[]> {
    return this.httpClient.get<Attribute[]>(URL_ALL_ATTRIBUTES_BY_VIEW().replace(':viewId', String(viewId)));
  }

  getAttributeByView(viewId: number, attributeId: number): Observable<Attribute> {
      return this.httpClient.get<Attribute>(URL_ATTRIBUTE_BY_VIEW()
          .replace(':viewId', String(viewId)).replace(':attributeId', String(attributeId)));
  }

  deleteAttribute(view: View, attribute: Attribute): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_UPDATE_ATTRIBUTE_STATUS().replace(':attributeId', String(attribute.id)).replace(':state', 'DELETED'), {});
  }

  searchAttribute(viewId: number, search: string): Observable<Attribute[]> {
    return this.httpClient.get<Attribute[]>(
        URL_SEARCH_ALL_ATTRIBUTES_BY_VIEW().replace(':viewId', String(viewId)).replace(':attribute', search));
  }

  addAttribute(view: View, attribute: Attribute): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_ADD_ATTRIBUTE_TO_VIEW().replace(':viewId', String(view.id)), {
            attributes: [attribute]
          });
  }

  updateAttribute(view: View, attribute: Attribute): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(
          URL_UPDATE_ATTRIBUTE(), {
            attributes: [attribute]
          });
  }
}

