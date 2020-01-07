import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {Attribute} from "../../model/attribute.model";
import {convert} from "../../service/conversion-attribute.service";
import {Attribute2} from "../model/server-side.model";
import {getAttributesInView} from "../../service/attribute.service";
import {ROLE_ADMIN, ROLE_VIEW} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        const ats: Attribute2[] = await getAttributesInView(viewId);

        const attr: Attribute[] = convert(ats);

        res.status(200).json(attr);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
