import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {Attribute} from "../../model/attribute.model";
import {convert} from "../../service/conversion-attribute.service";
import {Attribute2, AttributeMetadata2, AttributeMetadataEntry2} from "../model/server-side.model";
import {getAttributesInView} from "../../service/attribute.service";

const httpAction: any[] = [
    [
        check('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        const ats: Attribute2[] = await getAttributesInView(viewId);

        const attr: Attribute[] = convert(ats);

        res.status(200).json(attr);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/attributes/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;
