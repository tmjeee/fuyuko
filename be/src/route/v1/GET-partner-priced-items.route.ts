import {i} from "../../logger";
import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    param('viewId').exists().isNumeric(),
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

    }
]


const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/view/:viewId`
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}


export default reg;