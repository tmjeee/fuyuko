import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/partner-views`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;