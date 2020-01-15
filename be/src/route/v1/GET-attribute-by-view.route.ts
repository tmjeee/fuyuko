import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {check} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {Attribute2} from "../model/server-side.model";
import {getAttributesInView} from "../../service/attribute.service";
import {Attribute} from "../../model/attribute.model";
import {convert} from "../../service/conversion-attribute.service";


const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('attributeId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attributeId: number = Number(req.params.attributeId);

        const ats: Attribute2[] = await getAttributesInView(viewId, [attributeId]);

        const attr: Attribute[] = convert(ats);

        res.status(200).json(attr && attr.length > 0 ? attr[0] : null);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attribute/:attributeId/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
