import {NextFunction, Router, Request, Response} from 'express';
import {Registry} from '../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param, body} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {saveAttributes, newConsoleLogger} from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';

// CHECKED

const httpAction: any[] = [
    [
       param('viewId').exists().isNumeric(),
       body('attributes').isArray(),
       body('attributes.*.type').exists(),
       body('attributes.*.name').exists(),
       body('attributes.*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {


        const viewId: number = Number(req.params.viewId);
        const attrs: Attribute[] = req.body.attributes;

        const errors: string [] = await saveAttributes(viewId, attrs, newConsoleLogger);

        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Attributes added`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attributes/add`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
