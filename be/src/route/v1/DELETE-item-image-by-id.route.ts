import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {ClientError, validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import { param } from "express-validator";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {deleteItemImage} from "../../service/item-image.service";

// CHECK:
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

        const r: boolean = await deleteItemImage(itemId, itemImageId);

        if (r) {
            res.status(200).json({
               status: 'SUCCESS',
               message: `Item image deleted`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `Failed to delete itemId=${itemId} with itemImageId=${itemImageId}`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/item/:itemId/image/:itemImageId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};

export default reg;