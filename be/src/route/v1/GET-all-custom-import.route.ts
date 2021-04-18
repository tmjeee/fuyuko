import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {
    CustomDataImport,
} from '@fuyuko-common/model/custom-import.model';
import {getAllCustomImports} from "../../service/custom-import.service";
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const r: CustomDataImport[] = await getAllCustomImports();

        const apiResponse: ApiResponse<CustomDataImport[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Custom Data Import retrieval success`,
            }],
            payload: r
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-imports`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;