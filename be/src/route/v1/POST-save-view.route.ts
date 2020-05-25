import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {View} from "../../model/view.model";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {e} from '../../logger';
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";
import {addOrUpdateViews} from "../../service/view.service";


// CHECKED

const httpAction: any[] = [
    [
         body().isArray(),
         body('*.name').exists(),
         body('*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const views: View[] = req.body;

        const badUpdates: string[] = await addOrUpdateViews(views);

        if (badUpdates.length > 0) {
            e(`bad updates`, ...badUpdates);
            res.status(200).json({
                status: 'ERROR',
                message: badUpdates.join(', ')
            } as ApiResponse)
            return;
        }

        res.status(200).json({
           status: 'SUCCESS',
           message: `View(s) updated`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p =`/views/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
