
import {NextFunction, Router, Request, Response } from 'express';
import {Registry } from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {SelfRegistration} from '@fuyuko-common/model/self-registration.model';
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllSelfRegistrations} from '../../service';


// CHECKED

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const selfRegistrations: SelfRegistration[] = await getAllSelfRegistrations();
        const apiResponse: ApiResponse<SelfRegistration[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Self registrations retrieved`,
            }],
            payload: selfRegistrations
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/self-registers';
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
