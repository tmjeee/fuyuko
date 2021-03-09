import {Registry} from '../../registry';
import {NextFunction, Router, Response, Request} from 'express';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from './common-middleware';
import { param } from 'express-validator';
import fetch, {Response as FetchResponse} from 'node-fetch';
import showdown from 'showdown';
import config from '../../config';
import filetype, {FileTypeResult} from 'file-type';

// CHECKED
const httpAction: any[] = [
    [
        param(`helpPostfix`).exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const helpPostfix = req.params.helpPostfix;

        const fetchResponse: FetchResponse = await fetch(`${config['help-url-base']}/${helpPostfix}`);
        const text: string = await fetchResponse.text();


        const html: string = new showdown.Converter()
            .makeHtml(text);
        const ft: FileTypeResult = await filetype.fromBuffer(Buffer.from(html));

        res.status(200).contentType(ft ? ft.mime : 'text/html').end(html);
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/help/:helpPostfix`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
};

export default reg;