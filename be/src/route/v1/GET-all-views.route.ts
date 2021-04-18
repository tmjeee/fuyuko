import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {View} from '@fuyuko-common/model/view.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getAllViews} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const views: View[] = await getAllViews();
        const apiResponse: ApiResponse<View[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Views retrieved successfully`,
            }],
            payload: views
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/views`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
};

export default reg;
