import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from './common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {Group} from '@fuyuko-common/model/group.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {searchForGroupByName} from '../../service';

// CHECKED

const httpAction: any[] = [
    param('groupName').exists(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const groupName: string = req.params.groupName;
        const groups: Group[] = await searchForGroupByName(groupName);
        const apiResponse: ApiResponse<Group[]> = {
            messages: [{
                status: 'SUCCESS',
                message: `Groups retrieved`,
            }],
            payload: groups
        };
        res.status(200).json(apiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupName/search`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;