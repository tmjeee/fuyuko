import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";

const httpAction: any[] = [
   [
       check('viewId').exists().isNumeric()
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   async(req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);

        doInDbConnection((conn: PoolConnection) => {

            conn.query(`
                SELECT
                
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_ATTRIBUTE AS A ON A.ID = V.ITEM_ATTRIBUTE_ID
            `)

        });
   }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
