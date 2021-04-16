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
import {User} from '@fuyuko-common/model/user.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getUsersInGroup} from '../../service';

// CHECKED

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const groupId: number = Number(req.params.groupId);
        const u: User[] = await getUsersInGroup(groupId);
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
    const p = `/users/in-group/:groupId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
