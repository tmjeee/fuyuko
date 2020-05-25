import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Role, ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {getAllRoles} from "../../service/role.service";

// CHECKED
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const roles: Role[] = await getAllRoles();
        res.status(200).json({
            status: 'SUCCESS',
            message: `Roles retrieved successfully`,
            payload: roles
        } as ApiResponse<Role[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/roles`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
