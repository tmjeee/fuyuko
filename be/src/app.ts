import express, {Express, Router} from 'express';
require('express-async-errors');
import cookieParser from 'cookie-parser';
import registerV1AppRouter from './route/v1/v1-app.router';
import cors from 'cors';
import {i} from './logger';
import {runUpdater} from './updater';
import {runBanner} from './banner';
import config from './config';
import {catchErrorMiddlewareFn, httpLogMiddlewareFn, timingLogMiddlewareFn} from "./route/v1/common-middleware";
import {Registry} from "./registry";
import {runCustomRuleSync} from "./custom-rule";
import {validationResult} from 'express-validator';

runBanner();

const port: number = Number(config.port);
const app: Express = express();

app.use(timingLogMiddlewareFn);
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(httpLogMiddlewareFn);

app.all('*', cors());

const registry: Registry = Registry.newRegistry('api');
const apiRouter: Router = express.Router();
app.use('/api', apiRouter);
registerV1AppRouter(apiRouter, registry);
i('URL Mappings :-\n' + registry.print({indent: 2, text: ''}).text);
app.use(catchErrorMiddlewareFn);

export type PromiseFn = () => Promise<any>;

const fns: PromiseFn[] = [
    // db updater
    () => {
        i(`running db updater`);
        return runUpdater()
            .then((_: any) => {
                i(`done with db updater`);
            });
    },

    // rule sync
    () => {
        i(`running rule sync`)
        return runCustomRuleSync()
            .then((_: any) => {
                i(`done with rule sync`);
            });
    },

    // ready message
    () => {
        i(`Fuyuko ready for operation !!!`);
       return Promise.resolve();
    }
];

fns.reduce((p: Promise<any>, fn: PromiseFn) => {
    return p.then(_ => fn())
}, Promise.resolve());

app.listen(port, () => i(`Fuyuko API started listening at port ${port}`));
