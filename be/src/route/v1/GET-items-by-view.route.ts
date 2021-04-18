import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response } from 'express';
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from './common-middleware';
import {getItemsByIds, getItemsByIdsCount} from '../../service';
import {Item} from '@fuyuko-common/model/item.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {toLimitOffset} from '../../util/utils';

// CHECKED
const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('itemIds').exists(),
        // query('limit').isNumeric(),
        // query('offset').isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const itemIds: number[] = req.params.itemIds.split(',').map((i: string) => Number(i));
        const limitOffset: LimitOffset = toLimitOffset(req);

        const items: Item[] = await getItemsByIds(viewId, itemIds, true, limitOffset);
        const itemsTotal: number = await getItemsByIdsCount(viewId, itemIds);
        const apiResponse: PaginableApiResponse<Item[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Items received successfully`,
            }],
            payload: items,
            total: itemsTotal,
            offset: limitOffset ? limitOffset.offset : 0,
            limit: limitOffset ? limitOffset.limit : itemsTotal
        };
        res.status(200).json(apiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/:itemIds`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
