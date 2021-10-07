import {Injectable} from '@angular/core';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {Observable, of} from 'rxjs';
import {BulkEditPackage} from '@fuyuko-common/model/bulk-edit.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';
import {assertDefinedReturn} from '../../utils/common.util';

const URL_BULK_EDIT = () => `${config().api_host_url}/view/:viewId/preview-bulk-edit`;

@Injectable()
export class BulkEditService {

    constructor(private httpClient: HttpClient) {
    }


    previewBuilEdit(viewId: number, changeClauses: ItemValueAndAttribute[], whenClauses: ItemValueOperatorAndAttribute[]):
        Observable<BulkEditPackage> {

        return this.httpClient.post<ApiResponse<BulkEditPackage>>(
            URL_BULK_EDIT().replace(':viewId', String(viewId)), {
            changeClauses,
            whenClauses
        }).pipe(map((r: ApiResponse<BulkEditPackage>) => assertDefinedReturn(r.payload)));
    }
}
