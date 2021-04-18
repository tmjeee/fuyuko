import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {body} from 'express-validator';
import {
    aFnAnyTrue,
    getJwtPayload, v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {JwtPayload} from '@fuyuko-common/model/jwt.model';
import {getUserById} from "../../service";
import {User} from '@fuyuko-common/model/user.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {ApiResponse} from "@fuyuko-common/model/api-response.model";
import {updateUser} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        body('userId').exists(),
        body('firstName'),
        body('lastName'),
        body('email'),
        body('theme'),
        body('password'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const theme = req.body.theme;
        const password = req.body.password;

        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;


        // HANDLE WORKFLOW

        const errors: string[] = await updateUser({userId, firstName, lastName, email, theme, password});
        const user: User = await getUserById(userId);

        if (errors && errors.length) {
            const apiResponse: ApiResponse<User> = {
                messages: [{
                    status: 'ERROR',
                    message: errors.join(', '),
                }],
                payload: user
            };
            res.status(400).json(apiResponse);

        } else {
            const apiResponse: ApiResponse<User> = {
                messages: [{
                    status: 'SUCCESS',
                    message: `User saved`,
                }],
                payload: user
            };
            res.status(200).json(apiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) =>{
    const p = '/user';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
