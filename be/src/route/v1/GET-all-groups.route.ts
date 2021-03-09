import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {Group} from '@fuyuko-common/model/group.model';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {getAllGroups, getAllGroupsCount} from '../../service';

// CHECKED
const httpAction: any[] = [
    [],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const totalGroups: number = await getAllGroupsCount();
        const groups: Group[] = await getAllGroups();
        res.status(200).json({
            total: totalGroups,
            limit: totalGroups,
            offset: 0,
            payload: groups
        } as PaginableApiResponse<Group[]>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/groups`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
