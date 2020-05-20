import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {validateMiddlewareFn} from "./common-middleware";
import {isValidForgottenPasswordCode} from "../../service/auth.service";
import {ApiResponse} from "../../model/api-response.model";

const httpAction: any[] = [
    [
        param('code').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const code = req.params.code;

        const r: boolean = await isValidForgottenPasswordCode(code);
        res.status(200).json({
           status: 'SUCCESS',
           message: 'Validity retrieved',
           payload: r
        } as ApiResponse<boolean>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/forgot-password/code/:code/validity`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;