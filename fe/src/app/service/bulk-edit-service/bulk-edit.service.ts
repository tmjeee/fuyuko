import {Injectable} from '@angular/core';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {Observable, of} from 'rxjs';
import {BulkEditItem, BulkEditPackage} from '../../model/bulk-edit.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';

const URL_BULK_EDIT = () => `${config().api_host_url}/view/:viewId/preview-bulk-edit`;

@Injectable()
export class BulkEditService {

    constructor(private httpClient: HttpClient) {
    }


    previewBuilEdit(viewId: number, changeClauses: ItemValueAndAttribute[], whenClauses: ItemValueOperatorAndAttribute[]):
        Observable<BulkEditPackage> {

        return this.httpClient.post<BulkEditPackage>(
            URL_BULK_EDIT().replace(':viewId', String(viewId)), {
            changeClauses,
            whenClauses
        });
    }
}
