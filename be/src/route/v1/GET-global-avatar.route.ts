import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {Registry} from "../../registry";
import {BinaryContent} from '@fuyuko-common/model/binary-content.model';
import {getGlobalAvatarContentByName} from '../../service';

// CHECKED
const httpAction: any[] = [
    [
        check('avatarName').exists()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const avatarName: string  = req.params.avatarName;
        const binaryContent: BinaryContent = await getGlobalAvatarContentByName(avatarName);

        if (binaryContent) {
            res.setHeader('Content-Length', binaryContent.size)
            res.status(200)
                .contentType(binaryContent.mimeType)
                .end(binaryContent.content);
        } else {
            res.end();
        }
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = '/global/avatar/:avatarName';
    registry.addItem('GET', p);
    router.get(p, ...httpAction)
}

export default reg;
