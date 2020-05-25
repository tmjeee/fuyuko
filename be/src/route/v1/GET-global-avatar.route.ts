import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {Registry} from "../../registry";
import {BinaryContent} from "../../model/binary-content.model";
import {getGlobalAvatarContentByName} from "../../service/avatar.service";

// CHECKED
const httpAction: any[] = [
    [
        check('avatarName').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const avatarName: string  = req.params.avatarName;
        const binaryContent: BinaryContent = await getGlobalAvatarContentByName(avatarName);

        await doInDbConnection(async (conn: Connection) => {
            if (binaryContent) {
                res.setHeader('Content-Length', binaryContent.size)
                res.status(200)
                    .contentType(binaryContent.mimeType)
                    .end(binaryContent.content);
            } else {
                res.end();
            }
        });
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/global/avatar/:avatarName';
    registry.addItem('GET', p);
    router.get(p, ...httpAction)
}

export default reg;
