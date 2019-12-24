import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
const URL_ATTRIBUTES = `/attributes/view/:viewId`;
const URL_ = ``;
let ExportDataService = class ExportDataService {
    viewAttributeFn(viewId) {
        return of([
            { id: 1, type: 'string', name: 'attr #1', description: 'attr #1 description' },
            { id: 2, type: 'string', name: 'attr #2', description: 'attr #2 description' },
            { id: 3, type: 'string', name: 'attr #3', description: 'attr #3 description' },
            { id: 4, type: 'string', name: 'attr #4', description: 'attr #4 description' },
            { id: 5, type: 'string', name: 'attr #5', description: 'attr #5 description' },
        ]);
    }
    previewExportFn(exportType, viewId, attributes, filter) {
        return of({
            attributes: [
                { id: 1, type: 'string', name: 'attr #1', description: 'attr #1 description' },
                { id: 2, type: 'string', name: 'attr #2', description: 'attr #2 description' },
                { id: 3, type: 'string', name: 'attr #3', description: 'attr #3 description' },
                { id: 4, type: 'string', name: 'attr #4', description: 'attr #4 description' },
                { id: 5, type: 'string', name: 'attr #5', description: 'attr #5 description' },
            ],
            items: [
                { id: 1, name: 'item #1', description: 'item #1 description', images: [], parentId: undefined, children: [],
                    1: { attributeId: 1, val: { type: 'string', value: 'item 1 val 1' } },
                    2: { attributeId: 2, val: { type: 'string', value: 'item 1 val 2' } },
                    3: { attributeId: 3, val: { type: 'string', value: 'item 1 val 3' } },
                    4: { attributeId: 4, val: { type: 'string', value: 'item 1 val 4' } },
                    5: { attributeId: 5, val: { type: 'string', value: 'item 1 val 5' } },
                },
                { id: 2, name: 'item #2', description: 'item #2 description', images: [], parentId: undefined, children: [],
                    1: { attributeId: 1, val: { type: 'string', value: 'item 1 val 1' } },
                    2: { attributeId: 2, val: { type: 'string', value: 'item 1 val 2' } },
                    3: { attributeId: 3, val: { type: 'string', value: 'item 1 val 3' } },
                    4: { attributeId: 4, val: { type: 'string', value: 'item 1 val 4' } },
                    5: { attributeId: 5, val: { type: 'string', value: 'item 1 val 5' } },
                },
                { id: 3, name: 'item #3', description: 'item #3 description', images: [], parentId: undefined, children: [],
                    1: { attributeId: 1, val: { type: 'string', value: 'item 1 val 1' } },
                    2: { attributeId: 2, val: { type: 'string', value: 'item 1 val 2' } },
                    3: { attributeId: 3, val: { type: 'string', value: 'item 1 val 3' } },
                    4: { attributeId: 4, val: { type: 'string', value: 'item 1 val 4' } },
                    5: { attributeId: 5, val: { type: 'string', value: 'item 1 val 5' } },
                },
            ]
        });
    }
    submitExportJobFn(exportType, viewId, attributes, dataExport, filter) {
        return of({
            id: 900,
            name: `Export data job`,
            creationDate: new Date(),
            lastUpdate: new Date(),
            progress: 'SCHEDULED',
            status: 'ENABLED'
        });
    }
};
ExportDataService = tslib_1.__decorate([
    Injectable()
], ExportDataService);
export { ExportDataService };
//# sourceMappingURL=export-data.service.js.map