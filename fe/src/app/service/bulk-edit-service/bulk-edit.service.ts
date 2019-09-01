import {Injectable} from '@angular/core';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {Observable, of} from 'rxjs';
import {BulkEditItem, BulkEditPackage} from '../../model/bulk-edit.model';
import {StringValue} from '../../model/item.model';

const BULK_EDIT_PREVIEW: BulkEditPackage = {
    whenAttributes: [
        {id: 1, type: 'string', name: 'string attribute #1', description: 'string attribute #1 description'},
        {id: 2, type: 'string', name: 'string attribute #2', description: 'string attribute #2 description'},
        {id: 3, type: 'string', name: 'string attribute #3', description: 'string attribute #3 description'}
    ],
    changeAttributes: [
        {id: 4, type: 'string', name: 'string attribute #4', description: 'string attribute #4 description'},
        {id: 5, type: 'string', name: 'string attribute #5', description: 'string attribute #5 description'},
        {id: 6, type: 'string', name: 'string attribute #6', description: 'string attribute #6 description'}
    ],
    bulkEditItems: [
        {id: 1, name: 'bulkChangeItem#1', description: 'bulk change item #1', images: [], parentId: null, children: [],
            whens: {
                1: { attributeId: 1, val: {type: 'string', value: 'ttt1'} as StringValue },
                2: { attributeId: 2, val: {type: 'string', value: 'ttt2'} as StringValue },
                3: { attributeId: 3, val: {type: 'string', value: 'ttt3'} as StringValue }
            },
            changes: {
                4: {
                    old: { attributeId: 4, val: {type: 'string', value: 'old1'} as StringValue},
                    new: { attributeId: 4, val: {type: 'string', value: 'new1'} as StringValue}
                },
                5: {
                    old: { attributeId: 5, val: {type: 'string', value: 'old2'} as StringValue},
                    new: { attributeId: 5, val: {type: 'string', value: 'new2'} as StringValue}
                },
                6: {
                    old: { attributeId: 6, val: {type: 'string', value: 'old3'} as StringValue},
                    new: { attributeId: 6, val: {type: 'string', value: 'new3'} as StringValue}
                }
            },
        } as BulkEditItem,
        {id: 2, name: 'bulkChangeItem#2', description: 'bulk change item #2', images: [], parentId: null, children: [],
            whens: {
                1: { attributeId: 1, val: {type: 'string', value: 'ttt4'} as StringValue },
                2: { attributeId: 2, val: {type: 'string', value: 'ttt5'} as StringValue },
                3: { attributeId: 3, val: {type: 'string', value: 'ttt6'} as StringValue }
            },
            changes: {
                4: {
                    old: { attributeId: 4, val: {type: 'string', value: 'old4'} as StringValue},
                    new: { attributeId: 4, val: {type: 'string', value: 'new4'} as StringValue}
                },
                5: {
                    old: { attributeId: 5, val: {type: 'string', value: 'old5'} as StringValue},
                    new: { attributeId: 5, val: {type: 'string', value: 'new5'} as StringValue}
                },
                6: {
                    old: { attributeId: 6, val: {type: 'string', value: 'old6'} as StringValue},
                    new: { attributeId: 6, val: {type: 'string', value: 'new6'} as StringValue}
                }
            },
        } as BulkEditItem,
    ]
} as BulkEditPackage;

@Injectable()
export class BulkEditService {
    previewBuilEdit(viewId: number, changeClauses: ItemValueAndAttribute[], whereClauses: ItemValueOperatorAndAttribute[]):
        Observable<BulkEditPackage> {
        return of({...BULK_EDIT_PREVIEW});
    }

    scheduleBulkEdit(viewId: number, changeClauses: ItemValueAndAttribute[], whereClauses: ItemValueOperatorAndAttribute[]) {

    }
}
