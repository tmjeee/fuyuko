
import {Fields, Files, IncomingForm} from 'formidable';
import util from 'util';
import {IncomingMessage} from "http";

export const multipartParse = (req: IncomingMessage) => {
    const incomingForm = new IncomingForm();
    (incomingForm.parse as any)[util.promisify.custom] = (req: IncomingMessage) => new Promise((res, rej) => {
        incomingForm.parse(req, (err: any, fields: Fields, files: Files) => {
            if (err)
                rej(err);
            else
                res({fields, files})
        });
    });
    return util.promisify(incomingForm.parse as any)(req);
}