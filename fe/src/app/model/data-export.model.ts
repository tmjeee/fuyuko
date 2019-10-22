import {Attribute} from './attribute.model';
import {Item} from './item.model';


export interface DataExport {
    attributes: Attribute[];
    items: Item[];
}
