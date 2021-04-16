import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {User} from '@fuyuko-common/model/user.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {searchForUserNotInGroup} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        param('groupId').exists().isNumeric(),
        param('username')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const groupId: number = Number(req.params.groupId);
        const username: string = req.params.username;

        const u: User[] = await searchForUserNotInGroup(groupId, username);
        const apiResponse: ApiResponse<User[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Users retrieved`,
            }],
            payload: u
        };
        res.status(200).json(apiResponse);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/users/not-in-group/:groupId/:username?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
