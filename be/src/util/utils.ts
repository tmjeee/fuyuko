import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {Request} from 'express';

export function range(start: number, stop: number, step: number = 1) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};


export const isLimit = (limit: string): boolean => {
    return (!isNaN(Number(limit)) && Number.isInteger(Number(limit)) && Number(limit) > 0) ?  true : false;
};

export const isOffset = (offset: string): boolean => {
    return (!isNaN(Number(offset)) && Number.isInteger(Number(offset)) && Number(offset) >= 0) ? true : false;
}

export const toLimitOffset = (req: Request): LimitOffset => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const _isLimit = isLimit(limit);
    const _isOffset = isOffset(offset);
    if (_isLimit && _isOffset) {
        return { limit: Number(limit), offset: Number(offset)};
    }
    return undefined;
}


export const LIMIT_OFFSET = (limitoffset?: LimitOffset) => (limitoffset ? `LIMIT ${limitoffset.limit} OFFSET ${limitoffset.offset}` : ``);



