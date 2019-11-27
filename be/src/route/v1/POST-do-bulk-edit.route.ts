import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {param} from 'express-validator';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {Value} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";
import {OperatorType} from "../../model/operator.model";

const httpAction: any[] = [
   [
      param('viewId').exists().isNumeric()
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   async (req: Request, res: Response, next: NextFunction) => {

      const viewId: number = Number(req.params.viewId);

      doInDbConnection((conn: PoolConnection) => {

         const itemValueAndAttributes: ItemValueAndAttribute[] = req.body.changeClauses;
         const itemValueOperatorAndAttributes: ItemValueOperatorAndAttribute[] = req.body.whereClauses;

         for (const itemValueOperatorAndAttribute of itemValueOperatorAndAttributes) {

            const value: Value = itemValueOperatorAndAttribute.itemValue;
            const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
            const operator: OperatorType = itemValueOperatorAndAttribute.operator;




         }

      });
   }
]

const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId/bulk-edit`;
   registry.addItem('POST', p);
   router.post(p, ...httpAction);
}

export default reg;
