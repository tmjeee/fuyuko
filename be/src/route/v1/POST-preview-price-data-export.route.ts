import {Registry} from '../../registry';
import {NextFunction, Router, Request, Response} from 'express';
import {body, param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from './common-middleware';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {PriceDataExport} from '@fuyuko-common/model/data-export.model';
import {exportPricePreview, ExportPricePreviewResult} from '../../service';
import {ROLE_EDIT} from '@fuyuko-common/model/role.model';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {getPricingStructureById} from '../../service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('pricingStructureId').exists().isNumeric(),
        body('attributes').optional({nullable: true}).isArray(),
        body('filter').optional({nullable: true}).isArray()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const attributes: Attribute[] = req.body.attributes;
        const filter: ItemValueOperatorAndAttribute[] = req.body.filter;

        const p: ExportPricePreviewResult = await exportPricePreview(viewId, pricingStructureId, filter);
        const ps: PricingStructure = await getPricingStructureById(pricingStructureId);

        const priceDataExport: PriceDataExport = ({
            type: "PRICE",
            pricingStructure: ps,
            attributes: (attributes && attributes.length) ? attributes : [...p.m.values()],
            pricedItems: p.i,
        });

        res.status(200).json({
           status: 'SUCCESS',
           message: `Price data export preview ready`,
           payload: priceDataExport
        } as ApiResponse<PriceDataExport>);
    }
];


const x = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/export/pricingStructure/:pricingStructureId/prices/preview`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default x;
