import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ExportAttributePreviewEvent, fireEvent} from '../event/event.service';
import {getAttributesInView} from '../';

/**
 * ===============
 * === preview =====
 * ==================
 */
export const preview = async (viewId: number, attributes: Attribute[]): Promise<Attribute[]> => {
    if (attributes && attributes.length > 0) {
        // todo: lookup again from db?
        return attributes;
    }
    const att: Attribute[] = await getAttributesInView(viewId);
    
    fireEvent({
       type: 'ExportAttributePreviewEvent',
       attributes: att 
    } as ExportAttributePreviewEvent);
    
    return att;
}
