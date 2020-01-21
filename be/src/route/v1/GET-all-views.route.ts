import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {View} from "../../model/view.model";
import {ROLE_VIEW} from "../../model/role.model";
import {getAllViews} from "../../service/view.service";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const views: View[] = await getAllViews();
        res.status(200).json(views);
    }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/views`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
};

export default reg;
