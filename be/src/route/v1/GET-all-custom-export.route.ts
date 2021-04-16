import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {getAllCustomExports} from "../../service/custom-export.service";
import {CustomDataExport} from '@fuyuko-common/model/custom-export.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const r: CustomDataExport[] = await getAllCustomExports();

        const apiResponse: ApiResponse<CustomDataExport[]> = {
            messages: [{
                status: 'SUCCESS',
                message: 'Custom Data Export retrieval success',
            }],
            payload: r
        };
        res.status(200).json(apiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-exports`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;