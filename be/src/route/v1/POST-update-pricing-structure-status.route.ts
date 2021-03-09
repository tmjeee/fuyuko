import {Registry} from '../../registry';
import {Router, Request, Response, NextFunction} from 'express';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {param} from 'express-validator';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {updatePricingStructureStatus} from '../../service';
import {Status} from '@fuyuko-common/model/status.model';


// CHECKED

const httpAction: any[] = [
    [
       param('pricingStructureId').exists().isNumeric(),
       param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const status: string = req.params.status;

        const r: boolean = await updatePricingStructureStatus(pricingStructureId, status as Status);

        if (r) {
            res.status(200).json({
                status: "SUCCESS",
                message: `Pricing Structure status updated`
            } as ApiResponse)
        } else {
            res.status(200).json({
                status: "ERROR",
                message: `Pricing Structure status FAILED to be updated`
            } as ApiResponse)
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
