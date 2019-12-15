import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {Item, StringValue} from '../../model/item.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {
    AttributeDataExport,
    DataExportType,
    ItemDataExport,
    PriceDataExport
} from '../../model/data-export.model';
import {Job} from '../../model/job.model';

const URL_ATTRIBUTES = `/attributes/view/:viewId`;
const URL_ = ``;

@Injectable()
export class ExportDataService {

    viewAttributeFn(viewId: number): Observable<Attribute[]> {
        return of([
            { id: 1, type: 'string', name: 'attr #1', description: 'attr #1 description' } as Attribute,
            { id: 2, type: 'string', name: 'attr #2', description: 'attr #2 description' } as Attribute,
            { id: 3, type: 'string', name: 'attr #3', description: 'attr #3 description' } as Attribute,
            { id: 4, type: 'string', name: 'attr #4', description: 'attr #4 description' } as Attribute,
            { id: 5, type: 'string', name: 'attr #5', description: 'attr #5 description' } as Attribute,
        ]);
    }

    previewExportFn(exportType: DataExportType, viewId: number, attributes: Attribute[],
                    filter: ItemValueOperatorAndAttribute[]): Observable<AttributeDataExport | ItemDataExport | PriceDataExport> {
        return of({
            attributes: [
                { id: 1, type: 'string', name: 'attr #1', description: 'attr #1 description' } as Attribute,
                { id: 2, type: 'string', name: 'attr #2', description: 'attr #2 description' } as Attribute,
                { id: 3, type: 'string', name: 'attr #3', description: 'attr #3 description' } as Attribute,
                { id: 4, type: 'string', name: 'attr #4', description: 'attr #4 description' } as Attribute,
                { id: 5, type: 'string', name: 'attr #5', description: 'attr #5 description' } as Attribute,
            ],
            items: [
                { id: 1, name: 'item #1', description: 'item #1 description', images: [], parentId: undefined, children: [],
                    1: { attributeId: 1, val: { type: 'string', value: 'item 1 val 1' }  as StringValue },
                    2: { attributeId: 2, val: { type: 'string', value: 'item 1 val 2' }  as StringValue },
                    3: { attributeId: 3, val: { type: 'string', value: 'item 1 val 3' }  as StringValue },
                    4: { attributeId: 4, val: { type: 'string', value: 'item 1 val 4' }  as StringValue },
                    5: { attributeId: 5, val: { type: 'string', value: 'item 1 val 5' }  as StringValue },
                } as Item,

                { id: 2, name: 'item #2', description: 'item #2 description', images: [], parentId: undefined, children: [],
                    1: { attributeId: 1, val: { type: 'string', value: 'item 1 val 1' }  as StringValue },
                    2: { attributeId: 2, val: { type: 'string', value: 'item 1 val 2' }  as StringValue },
                    3: { attributeId: 3, val: { type: 'string', value: 'item 1 val 3' }  as StringValue },
                    4: { attributeId: 4, val: { type: 'string', value: 'item 1 val 4' }  as StringValue },
                    5: { attributeId: 5, val: { type: 'string', value: 'item 1 val 5' }  as StringValue },
                } as Item,

                { id: 3, name: 'item #3', description: 'item #3 description', images: [], parentId: undefined, children: [],
                    1: { attributeId: 1, val: { type: 'string', value: 'item 1 val 1' }  as StringValue },
                    2: { attributeId: 2, val: { type: 'string', value: 'item 1 val 2' }  as StringValue },
                    3: { attributeId: 3, val: { type: 'string', value: 'item 1 val 3' }  as StringValue },
                    4: { attributeId: 4, val: { type: 'string', value: 'item 1 val 4' }  as StringValue },
                    5: { attributeId: 5, val: { type: 'string', value: 'item 1 val 5' }  as StringValue },
                } as Item,
            ]
        } as ItemDataExport);
    }

    submitExportJobFn(exportType: DataExportType, viewId: number, attributes: Attribute[],
                      dataExport: AttributeDataExport | ItemDataExport | PriceDataExport,
                      filter: ItemValueOperatorAndAttribute[]): Observable<Job> {
        return of({
            id: 900,
            name: `Export data job`,
            creationDate: new Date(),
            lastUpdate: new Date(),
            progress: 'SCHEDULED',
            status: 'ENABLED'
        } as Job);
    }
}
