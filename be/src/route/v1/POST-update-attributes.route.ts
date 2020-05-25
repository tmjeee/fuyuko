import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check, body} from 'express-validator';
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {Attribute} from "../../model/attribute.model";
import {attributesRevert} from "../../service/conversion-attribute.service";
import {Attribute2} from "../../server-side-model/server-side.model";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";
import {updateAttributes} from "../../service/attribute.service";


// CHECKED

const httpAction: any[] = [
    [
        body('attributes').isArray(),
        body('attributes.*.id').exists().isNumeric(),
        body('attributes.*.type').exists(),
        body('attributes.*.name').exists(),
        body('attributes.*.description').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const atts: Attribute[] = req.body.attributes;

        const r: {errors: string[], updatedAttributeIds: number[]} = await updateAttributes(atts);

        if (r.errors && r.errors.length) {
            res.status(200).json({
                status: 'ERROR',
                message: r.errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Attributes ${r.updatedAttributeIds.join(',')} updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/attributes/update`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
