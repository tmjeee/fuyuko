import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import { param, body } from "express-validator";
import {runValidation} from "../../service/run-validation.service";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('name').exists(),
        body('description'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId = Number(req.params.viewId);
        const name = req.body.name;
        const description = req.body.description;

        const id: number = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
            
                INSERT INTO TBL_VIEW_VALIDATION (VIEW_ID, NAME, DESCRIPTION, PROGRESS) VALUES (?,?,?,?)
            `, [viewId, name, description, 'SCHEDULED']);

            const validationId: number = q.insertId;
            return validationId;
        });

        runValidation(viewId, id);

        res.status(200).json({
            ok: true,
            validationId: id
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validation`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
