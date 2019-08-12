import {Injectable} from '@angular/core';
import {ItemValueAndAttribute} from '../../model/item-attribute.model';
import {Observable, of} from 'rxjs';
import {BulkEditPackage} from '../../model/bulk-edit.model';

const BULK_EDIT_PREVIEW: BulkEditPackage = {
    whenAttributes: [
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
