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

        const badUpdates: string[] = [];
        for (const view of views) {
            await doInDbConnection(async (conn: Connection) => {
                const id = view.id;
                const name = view.name;
                const descrption = view.description;

                if (!!!id || id <= 0) { // create new copy
                    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_VIEW WHERE NAME = ?`, [name]);
                    if (qq[0].COUNT > 0) { // view with name already exists
                        badUpdates.push(`View name ${view.name} already exists`);
                    } else {
                        const q: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, 'ENABLED')`, [name, descrption]);
                        if (q.affectedRows == 0) {
                            badUpdates.push(`View name ${view.name} not persisted`);
                        }
                    }
                } else { // update
                    const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW SET NAME=?, DESCRIPTION=? WHERE ID=? AND STATUS='ENABLED'`, [name, descrption, id]);
                    if (q.affectedRows == 0) {
                        badUpdates.push(`View id ${view.id} not updated`);
                    }
                }
            });
        }

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
