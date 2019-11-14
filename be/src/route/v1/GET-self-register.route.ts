
import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {SelfRegistration} from "../../model/self-registration.model";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        await doInDbConnection(async (conn: PoolConnection) => {

            const  q: QueryA = await conn.query(`
                SELECT
                    ID,
                    USERNAME,
                    EMAIL,
                    FIRSTNAME,
                    LASTNAME,
                    PASSWORD,
                    CREATION_DATE,
                    ACTIVATED
                FROM TBL_SELF_REGISTER
                WHERE ACTIVATED = false
            `);

            const selfRegistrations: SelfRegistration[] = q.map((i: QueryI) => {
                return {
                    id: i.ID,
                    username: i.USERNAME,
                    email: i.EMAIL,
                    firstName: i.FIRSTNAME,
                    lastName: i.LASTNAME,
                    creationDate: i.CREATION_DATE,
                    activated: i.ACTIVATED
                } as SelfRegistration
            });

            res.status(200).json(selfRegistrations);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-registers';
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
