import {Router, Request, Response, NextFunction} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {Job} from "../../model/job.model";

const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        await doInDbConnection(async (conn: PoolConnection) => {
            const q: QueryA = await conn.query(`
                SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE, STATUS, PROGRESS FROM TBL_JOB
            `, []);

            const jobs: Job[] = q.reduce((acc: Job[], i: QueryI) => {
                const j: Job = {
                    id: i.ID,
                    name: i.NAME,
                    description: i.DESCRIPTION,
                    creationDate: i.CREATION_DATE,
                    lastUpdate: i.LAST_UPDATE,
                    status: i.STATUS,
                    progress: i.PROGRESS
                } as Job;
                return acc;
            }, []);

            res.status(200).json(jobs);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/jobs`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
