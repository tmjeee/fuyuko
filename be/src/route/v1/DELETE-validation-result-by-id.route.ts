import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import { param } from "express-validator";
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {deleteValidationResult} from "../../service/validation/validation.service";
import {toHttpStatus} from "./aid.";

export const invocation = async (viewId: number, validationId: number): Promise<ApiResponse> => {

    const r: boolean = await deleteValidationResult(viewId, validationId);

    if (r) {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'SUCCESS',
                message: `Deleted validation result for validation id ${validationId} successfully`
            }]
        };
        return apiResponse;
    } else {
        const apiResponse: ApiResponse = {
            messages: [{
                status: 'ERROR',
                message: `Failed to delete validation result for validation id ${validationId}`
            }]
        };
        return apiResponse;
    }
}

// CHECKED
const httpAction: any[] = [
   [
       param('validationId').exists().isNumeric(),
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
   async (req: Request, res: Response, next: NextFunction) => {

      const viewId: number = Number(req.params.viewId);
      const validationId: number = Number(req.params.validationId);

      const apiResponse = await invocation(viewId, validationId);
      res.status(toHttpStatus(apiResponse)).json(apiResponse);
   }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId/validation/:validationId`;
   registry.addItem('DELETE', p);
   router.delete(p, ...httpAction);
}

export default reg;
