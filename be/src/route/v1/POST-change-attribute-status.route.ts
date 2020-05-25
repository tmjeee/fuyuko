import {Registry } from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check, param} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";
import {changeAttributeStatus} from "../../service/attribute.service";
import {Status} from "../../model/status.model";

// CHECKED

const httpAction: any[] = [
    [
        param('attributeId').exists().isNumeric(),
        param('state').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const attributeId: number = Number(req.params.attributeId);
        const state: string = req.params.state;

        const r: boolean = await changeAttributeStatus(attributeId, state as Status);
        if (r) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Attribute ${attributeId} status changed`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `Attribute ${attributeId} status failed to be changed`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/attribute/:attributeId/state/:state`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
