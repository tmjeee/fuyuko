import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import { param } from "express-validator";

const httpAction: any[] = [
    [
        param('itemId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/item/:itemId/image/:itemImageId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
};

export default reg;