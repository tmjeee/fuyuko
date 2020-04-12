import {Attribute} from "../../model/attribute.model";
import {getAttribute2sInView} from "../attribute.service";
import {Attribute2} from "../../server-side-model/server-side.model";
import {attributesConvert} from "../conversion-attribute.service";


export const preview = async (viewId: number, attributes: Attribute[]): Promise<Attribute[]> => {
    if (attributes && attributes.length > 0) {
        // todo: lookup again from db?
        return attributes;
    }
    const a: Attribute2[] =  await getAttribute2sInView(viewId);
    const att: Attribute[] = attributesConvert(a);
    return att;
}
