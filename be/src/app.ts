import express, {Express, Router} from 'express';
require('express-async-errors');
import cookieParser from 'cookie-parser';
import registerV1AppRouter from './route/v1/v1-app.router';
import cors from 'cors';
import {i, w} from './logger';
import {runUpdater} from './updater';
import {runBanner} from './banner';
import config from './config';
import {
    auditMiddlewareFn,
    catchErrorMiddlewareFn,
    httpLogMiddlewareFn,
    threadLocalMiddlewareFn,
    timingLogMiddlewareFn
} from "./route/v1/common-middleware";
import {Registry} from "./registry";
import {runCustomRuleSync} from "./custom-rule";
import {Options} from "body-parser";
import {runCustomImportSync} from "./custom-import";
import {runCustomExportSync} from "./custom-export/custom-export-executor";
import {runTimezoner} from "./timezoner";
import {runCustomBulkEditSync} from "./custom-bulk-edit/custom-bulk-edit-executor";
import {
    destroyEventsSubscription,
    EventSubscriptionRegistry,
    registerEventsSubscription
} from "./service/event/event.service";

i(`Run Timezoner`);
runTimezoner(config.timezone);


const port: number = Number(config.port);
const app: Express = express();

const options: Options = {
   limit: config['request-payload-limit']
};

app.all('*', threadLocalMiddlewareFn);
app.use(timingLogMiddlewareFn);
app.use(express.urlencoded(options));
app.use(express.json(options));
app.use(express.text(options))
app.use(express.raw(options))
app.use(cookieParser());
app.use(httpLogMiddlewareFn);
app.use(catchErrorMiddlewareFn);

app.all('*', cors());
app.all('*',  auditMiddlewareFn);

const registry: Registry = Registry.newRegistry('api');
const apiRouter: Router = express.Router();
app.use('/api', apiRouter);
registerV1AppRouter(apiRouter, registry);
i('URL Mappings :-\n' + registry.print({indent: 2, text: ''}).text);

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

    // custom rule / validation sync
    () => {
        i(`running custom rule sync`)
        return runCustomRuleSync()
            .then((_: any) => {
                i(`done with custom rule sync`);
            });
    },

    // custom import sync
    () => {
        i(`running custom import sync`);
        return runCustomImportSync()
            .then((_: any) => {
                i(`done with custom import sync`);
            });
    },

    // custom export sync
    () => {
        i(`running custom export sync`);
        return runCustomExportSync()
            .then((_: any) => {
                i(`done with custom export sync`);
            });
    },

    () => {
        i(`running custom bulk edit sync`);
        return runCustomBulkEditSync()
            .then((_: any) => {
                i(`done with custom bulk edit sync`);
            });
    },

    () => {
        i(`registrying global event subscription`);
        return registerEventsSubscription().then((_: any) => {
            i(`done with global event subscription`);
        });
    },

    // ready message
    () => {
       return new Promise((res, rej) => {
           runBanner();
           i(`Fuyuko ready for operation !!!`);
           app.listen(port, () => {
               i(`Fuyuko API started listening at port ${port}`);
               res();
           });
       });
    }
];

fns.reduce((p: Promise<any>, fn: PromiseFn) => {
    return p.then(_ => fn())
}, Promise.resolve());

process.on('exit', () => {
    destroyEventsSubscription();
    i(`Fuyuko proces exit`);
});
process.on('uncaughtException', (e) => {
   w(`uncaught exception (in process)`, e)
});
process.on('unhandledRejection', (e) => {
   w(`unhandled rejection (in process)`, e)
});

