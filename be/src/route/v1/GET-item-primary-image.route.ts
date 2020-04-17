import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {check} from 'express-validator';
import {validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {BinaryContent} from "../../model/binary-content.model";
import {getItemPrimaryImage} from "../../service/item-image.service";

// CHECKED
const httpAction: any[] = [
    [
        check(`itemId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const itemId: number = Number(req.params.itemId);

        const binaryContent: BinaryContent = await getItemPrimaryImage(itemId);

        res.header('Content-Length',  String(binaryContent.size));
        res.status(200)
            .contentType(binaryContent.mimeType)
            .end(binaryContent.content);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/item/image/primary/:itemId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
