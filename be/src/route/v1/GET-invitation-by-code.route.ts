import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import { Invitation } from "../../model/invitation.model";
import {makeApiError, makeApiErrorObj} from "../../util";
import {Registry} from "../../registry";
import {ROLE_VIEW} from "../../model/role.model";

/**
 * Get invitation by code
 */
const httpAction = [
    [
        check('code').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const code: string = req.params.code;

        await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`
                SELECT 
                    R.ID AS ID, R.EMAIL AS EMAIL, R.CREATION_DATE AS CREATION_DATE, R.CODE AS CODE, R.ACTIVATED AS ACTIVATED, 
                    G.GROUP_ID AS GROUP_ID
                FROM TBL_INVITATION_REGISTRATION as R
                LEFT JOIN TBL_INVITATION_REGISTRATION_GROUP AS G ON G.INVITATION_REGISTRATION_ID = R.ID
                WHERE R.CODE = ?
            `, code);

            if (q1.length <= 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`Invalid code ${code}`, 'code', code, 'api')
                ));
                return;
            }

            const id: number = q1[0].ID;
            const activated: boolean = q1[0].ACTIVATED;
            const email: string = q1[0].EMAIL;
            const creationDate: Date = q1[0].CREATION_DATE;
            const groupIds: number[] = q1.reduce((acc: number[], c: QueryI) => {
               acc.push(c.GROUP_ID);
               return acc;
            }, []);

            res.status(200).json({
               id,
                activated,
                creationDate,
                email,
                groupIds
            } as Invitation);
        });
    }
]

const reg = (router: Router, registry: Registry) => {
   const p = '/invitations/:code';
   registry.addItem('GET', p);
   router.get(p, ...httpAction)
}

export default reg;
