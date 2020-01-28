import {param} from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {Settings} from "../../model/settings.model";
import {getSettings} from "../../service/user-settings.service";

const DEFAULT_SETTINGS: Settings = new Settings();
DEFAULT_SETTINGS.id = 0;
DEFAULT_SETTINGS.defaultOpenHelpNav = false;
DEFAULT_SETTINGS.defaultOpenSideNav = true;
DEFAULT_SETTINGS.defaultOpenSubSideNav = true;

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const settings: Settings = await doInDbConnection(async (conn: Connection) => {
            return await getSettings(userId, conn)
        });
        res.status(200).json(settings);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/settings`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
