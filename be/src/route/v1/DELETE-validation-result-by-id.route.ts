import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import { param } from "express-validator";
import {ROLE_EDIT} from "../../model/role.model";
import {doInDbConnection} from "../../db";
import { Connection } from "mariadb";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED
const httpAction: any[] = [
   [
       param('validationId').exists().isNumeric(),
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
   async (req: Request, res: Response, next: NextFunction) => {

      const viewId: number = Number(req.params.viewId);
      const validationId: number = Number(req.params.validationId);

      await doInDbConnection(async (conn: Connection) => {
          await conn.query(`DELETE FROM TBL_VIEW_VALIDATION WHERE ID=? AND VIEW_ID=?`, [validationId, viewId])
      });

      res.status(200).json({
        status: 'SUCCESS',
        message: `Deleted view successfully`
      } as ApiResponse);
   }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId/validation/:validationId`;
   registry.addItem('DELETE', p);
   router.delete(p, ...httpAction);
}

export default reg;
