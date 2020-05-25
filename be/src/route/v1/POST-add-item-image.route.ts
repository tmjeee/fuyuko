import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {Fields, Files, File} from "formidable";
import {multipartParse} from "../../service";
import util from "util";
import fs from "fs";
import fileType from "file-type";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ApiResponse} from "../../model/api-response.model";
import {addItemImage} from "../../service/item-image.service";

// CHECKED

const httpAction: any[] = [
    [
        param('itemId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const itemId: number = Number(req.params.itemId);
        const r: {fields: Fields, files: Files} = await multipartParse(req);

        const file1: File = r.files.upload1;
        const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(file1.path));

        const added = await addItemImage(itemId, file1.name, buffer);

        if (added) {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Item image uploaded`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: 'ERROR',
                message: `Unable to created uploaded item image ${file1.name}`
            } as ApiResponse);
        }
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/item/:itemId/image`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;