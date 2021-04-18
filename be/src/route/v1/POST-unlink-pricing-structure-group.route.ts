import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import { param } from 'express-validator';
import {
    unlinkPricingStructureWithGroupId
} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const httpAction: any[] = [
    [
        param('pricingStructureId').exists().isNumeric(),
        param('groupId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const groupId: number = Number(req.params.groupId);
        const errors: string[] = await unlinkPricingStructureWithGroupId(pricingStructureId, groupId);
        if (errors && errors.length) {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', ')
                }]
            };
            res.status(400).json(apiResponse);
        } else {
            const apiResponse: ApiResponse = {
                messages: [{
                    status: 'SUCCESS',
                    message: `pricing structure ${pricingStructureId} and group ${groupId} unlinked successfully`
                }]
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricing-structure/:pricingStructureId/group/:groupId/unlink`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;