import {Attribute, Pair2} from '@fuyuko-common/model/attribute.model';

export type doubleSelectToMapType = (attribute: Attribute) => Pair2Map;

export interface Pair2Map {
    [key1: string]: {
        key: string,
        value: string;
    }[];
}

export const doubleSelectToObjectMap: doubleSelectToMapType  = (attribute: Attribute) => {
    return attribute.pair2.reduce((o: Pair2Map, p: Pair2) => {
        if (!o[p.key1]) {
            o[p.key1] = [];
        }
        o[p.key1].push({key: p.key2, value: p.value});
        return o;
    }, {});
}
