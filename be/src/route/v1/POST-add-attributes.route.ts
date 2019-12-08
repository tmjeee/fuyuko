import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param, body, check} from 'express-validator';
import {doInDbConnection, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {revert} from "../../service/conversion-attribute.service";
import {Attribute2} from "../model/server-side.model";
import {ApiResponse} from "../../model/response.model";
import {saveAttribute2s} from "../../service/attribute.service";

const httpAction: any[] = [
    [
       check('viewId').exists().isNumeric(),
       body('attributes').isArray(),
       body('attributes.*.type').exists(),
       body('attributes.*.name').exists(),
       body('attributes.*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attrs2: Attribute2[] = revert(req.body.attributes);

        await saveAttribute2s(attrs2);

        res.status(200).json({
            status: 'SUCCESS',
            message: `Attributes added`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attrbutes/add`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
