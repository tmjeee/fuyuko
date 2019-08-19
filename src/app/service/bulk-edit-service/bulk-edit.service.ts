import {Injectable} from '@angular/core';
import {ItemValueAndAttribute} from '../../model/item-attribute.model';
import {Observable, of} from 'rxjs';
import {BulkEditPackage} from '../../model/bulk-edit.model';

const BULK_EDIT_PREVIEW: BulkEditPackage = {
    whenAttributes: [
        {id: 1, type: 'string', name: 'string attribute #1', description: 'string attribute #1 description'},
        {id: 2, type: 'string', name: 'string attribute #2', description: 'string attribute #2 description'},
        {id: 3, type: 'string', name: 'string attribute #3', description: 'string attribute #3 description'}
    ],
    changeAttributes: [
    ],
    bulkEditItems: [
    ]
} as BulkEditPackage;

@Injectable()
export class BulkEditService {


    previewBuilEdit(id: number, changeClauses: ItemValueAndAttribute[], whereClauses: ItemValueAndAttribute[]):
        Observable<BulkEditPackage> {
        return of({...BULK_EDIT_PREVIEW});
    }
}
