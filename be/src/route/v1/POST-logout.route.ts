import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {Registry} from "../../registry";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Logged out, have a nice day'
        } as ApiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/logout';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
