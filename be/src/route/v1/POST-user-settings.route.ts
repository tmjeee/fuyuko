import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {DEFAULT_SETTINGS, updateUserSettings} from "../../service/user-settings.service";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);

        const errors: string[] = await updateUserSettings(userId, req.body);

        if (errors && errors.length) {
            res.status(200).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);

        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Settings updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/settings`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
