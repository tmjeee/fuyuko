import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import { param } from "express-validator";
import {ROLE_EDIT} from "../../model/role.model";
import {doInDbConnection} from "../../db";
import { Connection } from "mariadb";

const httpAction: any[] = [
   [
       param('validationId').exists().isNumeric(),
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
   async (req: Request, res: Response, next: NextFunction) => {

      const validationId: number = Number(req.params.validationId);

      await doInDbConnection(async (conn: Connection) => {
          await conn.query(`DELETE FROM TBL_VIEW_VALIDATION WHERE ID=?`, [validationId])
      });

      res.status(200).json(true);
   }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/validation/:validationId`;
   registry.addItem('DELETE', p);
   router.delete(p, ...httpAction);
}

export default reg;
