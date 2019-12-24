import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import config from '../../utils/config.util';
import { HttpClient } from "@angular/common/http";
const BULK_EDIT_PREVIEW = {
    whenAttributes: [
        { id: 1, type: 'string', name: 'string attribute #1', description: 'string attribute #1 description' },
        { id: 2, type: 'string', name: 'string attribute #2', description: 'string attribute #2 description' },
        { id: 3, type: 'string', name: 'string attribute #3', description: 'string attribute #3 description' }
    ],
    changeAttributes: [
        { id: 4, type: 'string', name: 'string attribute #4', description: 'string attribute #4 description' },
        { id: 5, type: 'string', name: 'string attribute #5', description: 'string attribute #5 description' },
        { id: 6, type: 'string', name: 'string attribute #6', description: 'string attribute #6 description' }
    ],
    bulkEditItems: [
        { id: 1, name: 'bulkChangeItem#1', description: 'bulk change item #1', images: [], parentId: null, children: [],
            whens: {
                1: { attributeId: 1, operator: 'eq', val: { type: 'string', value: 'ttt1' } },
                2: { attributeId: 2, operator: 'eq', val: { type: 'string', value: 'ttt2' } },
                3: { attributeId: 3, operator: 'eq', val: { type: 'string', value: 'ttt3' } }
            },
            changes: {
                4: {
                    old: { attributeId: 4, val: { type: 'string', value: 'old1' } },
                    new: { attributeId: 4, val: { type: 'string', value: 'new1' } }
                },
                5: {
                    old: { attributeId: 5, val: { type: 'string', value: 'old2' } },
                    new: { attributeId: 5, val: { type: 'string', value: 'new2' } }
                },
                6: {
                    old: { attributeId: 6, val: { type: 'string', value: 'old3' } },
                    new: { attributeId: 6, val: { type: 'string', value: 'new3' } }
                }
            },
        },
        { id: 2, name: 'bulkChangeItem#2', description: 'bulk change item #2', images: [], parentId: null, children: [],
            whens: {
                1: { attributeId: 1, operator: 'eq', val: { type: 'string', value: 'ttt4' } },
                2: { attributeId: 2, operator: 'eq', val: { type: 'string', value: 'ttt5' } },
                3: { attributeId: 3, operator: 'eq', val: { type: 'string', value: 'ttt6' } }
            },
            changes: {
                4: {
                    old: { attributeId: 4, val: { type: 'string', value: 'old4' } },
                    new: { attributeId: 4, val: { type: 'string', value: 'new4' } }
                },
                5: {
                    old: { attributeId: 5, val: { type: 'string', value: 'old5' } },
                    new: { attributeId: 5, val: { type: 'string', value: 'new5' } }
                },
                6: {
                    old: { attributeId: 6, val: { type: 'string', value: 'old6' } },
                    new: { attributeId: 6, val: { type: 'string', value: 'new6' } }
                }
            },
        },
    ]
};
const URL_BULK_EDIT = `${config.api_host_url}/view/:viewId/preview-bulk-edit`;
let BulkEditService = class BulkEditService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    previewBuilEdit(viewId, changeClauses, whenClauses) {
        // return of({...BULK_EDIT_PREVIEW});
        // const changeClauses: ItemValueAndAttribute[] = req.body.changeClauses;
        // const whenClauses: ItemValueOperatorAndAttribute[] = req.body.whenClauses;
        return this.httpClient.post(URL_BULK_EDIT.replace(':viewId', String(viewId)), {
            changeClauses,
            whenClauses
        });
    }
};
BulkEditService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], BulkEditService);
export { BulkEditService };
//# sourceMappingURL=bulk-edit.service.js.map