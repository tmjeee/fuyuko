import {param} from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {Settings} from "../../model/settings.model";
import {getSettings} from "../../service/user-settings.service";
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
        const settings: Settings = await getSettings(userId);
        res.status(200).json({
            status: 'SUCCESS',
            message: `Settings retrieved`,
            payload: settings
        } as ApiResponse<Settings>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/settings`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
