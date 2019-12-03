import {Registry, Request, Response, NextFunction} from "../../registry";
import {Router} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";

const httpAction: any[] = [
    [
        param('jobId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        doInDbConnection((conn: PoolConnection) => {

            conn.query(`
                SELECT 
                    
                FROM TBL_JOB AS J
                LEFT JOIN TBL_JOB_LOG AS L ON L.JOB_ID = J.ID
                WHERE J.ID=?
            `);

        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/job/:jobId/details`;
    registry.addItem('GET', p);
    registry.get(p, ...httpAction);
}

export default reg;
