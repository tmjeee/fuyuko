import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import { param } from "express-validator";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {ValidationError, ValidationLog, ValidationResult} from "../../model/validation.model";
import {ApiResponse} from "../../model/api-response.model";
import {getViewValidationResult} from "../../service/validation.service";


// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('validationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const validationId: number = Number(req.params.validationId);

        const _r: ValidationResult = await getViewValidationResult(viewId, validationId);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Validation result retrieved`,
            payload: _r
        } as ApiResponse<ValidationResult>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validation/:validationId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
