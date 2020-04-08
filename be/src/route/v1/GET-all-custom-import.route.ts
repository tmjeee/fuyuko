import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {
    CustomDataImport,
} from "../../model/custom-import.model";
import {getAllCustomImports} from "../../service/custom-import.service";

const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const r: CustomDataImport[] = await getAllCustomImports();

        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-imports`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;