import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_ADMIN} from '@fuyuko-common/model/role.model';
import {addOrUpdateGroup} from '../../service';
import {Group} from '@fuyuko-common/model/group.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {body} from 'express-validator';

const httpAction: any[] = [
    [
        body('id').exists().isNumeric(),
        body(`name`).exists(),
        body(`description`).exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const g: Group = req.body as Group;
        const errors: string[] = await addOrUpdateGroup(g);
        if (errors && errors.length) {
            res.status(400).json({
               status: 'ERROR',
               message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Group ${g.name} updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/group`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;