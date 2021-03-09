import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import { param } from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from './common-middleware';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {markItemImageAsPrimary} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        param('itemId').exists().isNumeric(),
        param('itemImageId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const itemId: number = Number(req.params.itemId);
        const itemImageId: number = Number(req.params.itemImageId);

        const errors: string[] = await markItemImageAsPrimary(itemId, itemImageId);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Image updated as primary`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {

    const p = `/item/:itemId/image/:itemImageId/mark-primary`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;