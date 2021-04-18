import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import {check} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAttributesInView} from '../../service';

// CHECKED
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

        const attr: Attribute[] = await getAttributesInView(viewId, [attributeId]);
        const apiResponse: ApiResponse<Attribute> = {
            messages: [{
                status: 'SUCCESS',
                message: `Attribute retrieved successfully`,
            }],
            payload: (attr && attr.length > 0 ? attr[0] : null)
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attribute/:attributeId/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
