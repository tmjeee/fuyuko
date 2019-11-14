import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {Registry} from "../../registry";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({});
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/logout';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
