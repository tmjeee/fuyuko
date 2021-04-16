import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {check} from 'express-validator';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {searchAttributesByView} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('attribute')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attribute: string = req.params.attribute ? req.params.attribute : '';

        const attr: Attribute[] = await searchAttributesByView(viewId, attribute);
        const apiResponse: ApiResponse<Attribute[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Attributes retrieved`,
            }],
            payload: attr
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId/search/:attribute?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
