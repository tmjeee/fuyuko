import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn} from "./common-middleware";
import {JwtPayload} from "../../model/jwt.model";
import * as formidable from 'formidable';
import {Fields, Files, IncomingForm, File} from 'formidable';
import {multipartParse} from "../../service";

const httpAction: any[] = [

    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const jwtPayload: JwtPayload = res.locals.jwtPayload;

        const r: {fields: Fields, files: Files} = await multipartParse(req);

        const globalAvatarName: string = r.fields.globalAvatarName as string;
        const customAvatarFile: File = r.files.customAvatarFile as File;

        console.log(globalAvatarName);
        console.log(customAvatarFile);

        res.end();
    }

];

const reg = (router: Router) => {
    router.post('/user/avatar', ...httpAction);
};

export default reg;