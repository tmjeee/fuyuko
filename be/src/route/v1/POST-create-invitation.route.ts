import {NextFunction, Router, Request, Response } from 'express';
import {body} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Registry} from '../../registry';
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {createInvitation} from '../../service';

// CHECKED

const httpAction = [
    [
        body('email').isLength({min:1}).isEmail(),
        body('groupIds').isArray(),
        body('groupIds.*').isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const email: string = req.body.email;
        const groupIds: number[] = req.body.groupIds;

        const errors: string[] = await createInvitation(email, groupIds);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);

        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Invitation Created'
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/create-invitation';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
