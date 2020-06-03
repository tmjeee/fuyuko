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
import {attributesConvert} from "../../service/conversion-attribute.service";
import {Attribute2} from "../../server-side-model/server-side.model";
import {getAttribute2sInView, getTotalAttributesInView} from "../../service/attribute.service";
import {ROLE_ADMIN, ROLE_VIEW} from "../../model/role.model";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {toLimitOffset} from "../../util/utils";
import {LimitOffset} from "../../model/limit-offset.model";

// CHECKED
const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const limitOffset: LimitOffset = toLimitOffset(req);

        const total: number = await getTotalAttributesInView(viewId);
        const ats: Attribute2[] = await getAttribute2sInView(viewId, null, limitOffset);

        const attr: Attribute[] = attributesConvert(ats);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Attributes retrival successful`,
            payload: attr,
            total,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0
        } as PaginableApiResponse<Attribute[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
