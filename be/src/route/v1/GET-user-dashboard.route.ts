import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {getUserDashboardSerializedData} from "../../service/dashboard.service";

// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const f: string = await  getUserDashboardSerializedData(userId);
        res.status(200).json({
            status: 'SUCCESS',
            message: `Dashboard retrieved`,
            payload: {
                data: f
            }
        } as ApiResponse<{data: string}>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
