import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";
import {Job} from "../../model/job.model";

const httpAction: any[] = [
    [
        param('jobId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const jobId: number = Number(req.params.jobId);

        const job: Job = await doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryA = await conn.query(`
                SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE, STATUS, PROGRESS FROM TBL_JOB WHERE ID=? 
                
            `, [jobId]);

            return {
                id: q[0].ID,
                name: q[0].NAME,
                description: q[0].DESCRIPTION,
                creationDate: q[0].CREATION_DATE,
                lastUpdate: q[0].LAST_UPDATE,
                status: q[0].STATUS,
                progress: q[0].PROGRESS
            } as Job;
        });

        res.status(200).json(job);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/job/:jobId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;