import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {Group} from '@fuyuko-common/model/group.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {getGroupById} from '../../service';


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
        const group: Group = await getGroupById(groupId);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Group retrieved successfully`,
            payload: group
        } as ApiResponse<Group>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
