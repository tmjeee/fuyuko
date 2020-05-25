import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {check} from 'express-validator';
import {validateMiddlewareFn} from "./common-middleware";
import {BinaryContent} from "../../model/binary-content.model";
import {getItemImageContent} from "../../service/item-image.service";

// CHECKED
const httpAction: any[] = [
    [
        check(`itemImageId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const itemImageId: number = Number(req.params.itemImageId);
        const binaryContent: BinaryContent = await getItemImageContent(itemImageId);

        res.header('Content-Length', String(binaryContent.size));
        res.status(200)
            .contentType(binaryContent.mimeType)
            .end(binaryContent.content);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/item/image/:itemImageId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;