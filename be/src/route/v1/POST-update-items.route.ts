import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {body, param} from 'express-validator';
import {Item} from '@fuyuko-common/model/item.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {addOrUpdateItem} from "../../service";

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('items').isArray(),
        body('items.*.name').exists(),
        body('items.*.description').exists(),
        // body('items.*.parentId').exists()
        // todo: need to check [0].attributeId etc.
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const items: Item[] = req.body.items;

        const errors: string[] = [];
        for (const item of items) {
            const err: string[] = await addOrUpdateItem(viewId, item);
            errors.push(...err);
        }

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `item(s) updated`
            } as ApiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
