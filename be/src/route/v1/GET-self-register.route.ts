
import {NextFunction, Router, Request, Response } from "express";
import {Registry } from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {SelfRegistration} from "../../model/self-registration.model";
import {ROLE_ADMIN} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {getAllSelfRegistrations} from "../../service/self-registration.service";


// CHECKED

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const selfRegistrations: SelfRegistration[] = await getAllSelfRegistrations();
        res.status(200).json({
            status: 'SUCCESS',
            message: `Self registrations retrieved`,
            payload: selfRegistrations
        } as ApiResponse<SelfRegistration[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-registers';
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
