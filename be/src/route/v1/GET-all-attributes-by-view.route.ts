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
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {getAttributesInView, getTotalAttributesInView} from "../../service/attribute.service";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {toLimitOffset} from "../../util/utils";
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';

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
        const attr: Attribute[] = await getAttributesInView(viewId, null, limitOffset);

        const apiResponse: PaginableApiResponse<Attribute[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Attributes retrival successful`,
            }],
            payload: attr,
            total,
            limit: limitOffset ? limitOffset.limit : total,
            offset: limitOffset ? limitOffset.offset : 0
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
