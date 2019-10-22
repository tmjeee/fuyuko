import {Item} from './item.model';
import {Attribute} from './attribute.model';
import {Messages} from './notification-listing.model';


export interface DataImport {
    messages: Messages;
    attributes: Attribute[];
    items: Item[];
}

