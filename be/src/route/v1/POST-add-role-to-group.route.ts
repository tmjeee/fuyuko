import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ROLE_ADMIN, ROLE_EDIT} from "../../model/role.model";
import {addRoleToGroup} from "../../service/role.service";

// CHECKED

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('roleName').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const roleName: string = req.params.roleName;

        const errors: string[] = await addRoleToGroup(groupId, roleName);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Role ${roleName} added to group ${groupId}`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/role/:roleName';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
