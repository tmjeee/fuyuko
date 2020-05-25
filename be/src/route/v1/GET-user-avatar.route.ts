import {NextFunction, Request, Response, Router} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {Registry} from "../../registry";
import {BinaryContent} from "../../model/binary-content.model";
import {getUserAvatarContent} from "../../service/user.service";

// CHECKED

const httpAction = [
    [
        check('userId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.params.userId;

        const binaryContent: BinaryContent =  await getUserAvatarContent(Number(userId));
        if (binaryContent) {
            res.setHeader('Content-Length', binaryContent.size);
            res.status(200)
                .contentType(binaryContent.mimeType)
                .end(binaryContent.content);
        } else {
            res.end();
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/user/:userId/avatar';
    registry.addItem('GET', p);
    router.get(p, ...httpAction)
}

export default reg;
