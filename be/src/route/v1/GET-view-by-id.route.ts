import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {getViewById} from "../../service/view.service";
import {View} from "../../model/view.model";

const httpAction: any[] = [
   [
       param('viewId').exists().isNumeric()
   ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const view: View = await getViewById(viewId);
        res.status(200).json(view);
    }
]


const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
};

export default reg;