import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {getAllCustomExports} from "../../service/custom-export.service";
import {CustomDataExport} from "../../model/custom-export.model";

const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const r: CustomDataExport[] = await getAllCustomExports();

        res.status(200).json(r);

    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-exports`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;