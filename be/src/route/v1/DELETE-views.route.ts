import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {body} from 'express-validator';
import {View} from '@fuyuko-common/model/view.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {deleteView} from "../../service/view.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (viewIds: number[]): Promise<ApiResponse> => {

    const errors: string[] = [];
    for (const viewId of viewIds) {
        const r: boolean = await deleteView(viewId);
        if (!r) {
            errors.push(`Failed to delete view id ${viewId}`);
        }
    }

    if (errors && errors.length) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: errors.join(', ')
            }]
        };
        return apiResponse;
    } else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `Views deleted`
            }]
        };
        return apiResponse;
    }
}


const httpAction: any[] = [
    [
        body().isArray(),
        body('*.id').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const views: View[] =  req.body;

        const apiResponse = await invocation(views.map(v => v.id));
        res.status(toHttpStatus(apiResponse)).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/views/delete`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
