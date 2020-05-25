import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {attributesConvert} from "../../service/conversion-attribute.service";
import {Attribute2, AttributeMetadata2, AttributeMetadataEntry2} from "../../server-side-model/server-side.model";
import {Attribute} from "../../model/attribute.model";
import {check} from 'express-validator';
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";
import {searchAttributesByView} from "../../service/attribute.service";

// CHECKED

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric(),
        check('attribute')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attribute: string = req.params.attribute ? req.params.attribute : '';

        const attr: Attribute[] = await searchAttributesByView(viewId, attribute);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Attributes retrieved`,
            payload: attr
        } as ApiResponse<Attribute[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId/search/:attribute?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
