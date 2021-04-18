import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getUserDashboardSerializedData} from '../../service';

// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = Number(req.params.userId);
        const f: string = await  getUserDashboardSerializedData(userId);
        const apiResponse: ApiResponse<{data: string}> = {
            messages: [{
                status: 'SUCCESS',
                message: `Dashboard retrieved`,
            }],
            payload: {
                data: f
            }
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
