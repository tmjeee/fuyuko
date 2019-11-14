import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/add-user/:userId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;