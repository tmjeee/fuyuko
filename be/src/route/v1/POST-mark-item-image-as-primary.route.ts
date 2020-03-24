import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";

const httpAction: any[] = [
    [
        param('itemId').exists().isNumeric(),
        param('itemImageId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

    }
];

const reg = (router: Router, registry: Registry) => {

    const p = `/item/:itemId/image/:itemImageId/mark-primary`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

};

export default reg;