import {NextFunction, Router, Request, Response} from "express";
import {check} from 'express-validator';
import {validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";

const activateHttpAction = [
    [
        check('code').isLength({ min: 1 })
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response , next: NextFunction ) => {
        const code = req.params['code'];

        await doInDbConnection(async (conn: PoolConnection) => {
            const q1: QueryA = await conn.query(`
                SELECT ID, EMAIL, CREATION_DATE, CODE, ACTIVATED FROM TBL_INVITATION_REGISTRATION WHERE CODE=? AND ACTIVATED=?
            `, [code, false]);

            if (q1.length <= 0) { // bad code
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`Code no longer active`, 'code', code, 'api')
                ));
                return;
            }

            await conn.query(`UPDATE TBL_INVITATION_REGISTRATION SET ACTIVATED=? WHERE CODE=?`,[true, code]);

            const qGroups: QueryA = await conn.query(`
                SELECT GROUP_ID FROM TBL_INVITATION_REGISTRATION_GROUP WHERE INVITATION_REGISTRATION_ID = ? 
            `, [q1[0].ID]);

            // activate
            conn.query(`
                INSERT INTO TBL_USER (
            `);

            conn.query(`
                INSERT INTO TBL_USER_THEME
            `);

            conn.query(`
                INSERT INTO TBL_GROUP
            `);

        });




        res.json()
    }
];

const reg = (router: Router) => {
    router.get('/activate-invitation/:code', ...activateHttpAction);
}
