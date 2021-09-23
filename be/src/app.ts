// import 'module-alias/register';   // module-alise for @fuyuko-*
import moment from 'moment';
import 'source-map-support/register';
import express, {Express, Router, Request as ExpressRequest, Response as ExpressResponse} from 'express';
import 'express-async-errors';    // catch async errors
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
} from './route/v1/common-middleware';
import {Registry} from './registry';
import {runCustomRuleSync} from './custom-rule';
import {Options} from 'body-parser';
import {runCustomImportSync} from './custom-import';
import {runCustomExportSync} from './custom-export';
import {runTimezoner} from './timezoner';
import {runCustomBulkEditSync} from './custom-bulk-edit';
import {
    destroyEventsSubscription,
    registerEventsSubscription
} from './service/event/event.service';
import {runCustomWorkflowSync} from './custom-workflow';
import morgan from 'morgan';
import {graphqlUploadExpress} from "graphql-upload";
import {graphqlHTTP, GraphQLParams, RequestInfo} from "express-graphql";
import {buildAppSchema} from "./gql-schema";
import {GraphQLError, GraphQLFormattedError, print} from 'graphql';
import {IncomingMessage, ServerResponse} from "http";


export type Request = ExpressRequest & IncomingMessage & {
    url: string;
};
export type Response = ExpressResponse & ServerResponse & {
    json?: (data: unknown) => void;
};
export interface GqlContext {
    req: Request,
    res: Response,
    gqlParams: GraphQLParams | undefined,
}




process.on('exit', async () => {
    await destroyEventsSubscription();
    i(`Fuyuko proces exit`);
});
process.on('uncaughtException', (e) => {
    w(`uncaught exception (in process)`, e)
});
process.on('unhandledRejection', (e) => {
    w(`unhandled rejection (in process)`, e)
});

i(`Run Timezoner`);
runTimezoner(config.timezone);

const port: number = Number(config.port);
const app: Express = express();

const options: Options = {
   limit: config['request-payload-limit']
};

app.use(morgan('dev'));
app.all('*', threadLocalMiddlewareFn);
app.all('/api/*',  auditMiddlewareFn);

app.use(timingLogMiddlewareFn);
app.use(express.urlencoded(options));
app.use(express.json(options));
app.use(express.text(options))
app.use(express.raw(options))
app.use(cookieParser());
app.use(httpLogMiddlewareFn);
app.use(catchErrorMiddlewareFn);
app.use(cors());
app.use(
    '/gql',
    [
        graphqlUploadExpress({maxFileSize: 1000000000, maxFiles: 1000}),
        graphqlHTTP(async (req, res, gqlParams) => {
            const context: GqlContext = {
                req: (req as Request),
                res: (res as Response),
                gqlParams
            };
            return {
               schema: await buildAppSchema(),
               pretty: true,
               graphiql: true,
               rootValue: {},
               context,
               extensions: (requestInfo: RequestInfo): any => {
                   i(`${requestInfo.operationName ?? '<unknown>' } - ${print(requestInfo.document)}`);
                   return undefined;
               },
               customFormatErrorFn: (err: GraphQLError): GraphQLFormattedError => {
                   return {
                       ...err,
                       'date': moment(),
                   } as any;
               }
            }
        }),
    ]
);

const registry: Registry = Registry.newRegistry('api');
const apiRouter: Router = express.Router();
app.use('/api', apiRouter);
const v1AppRouter = registerV1AppRouter(apiRouter, registry);
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
        i(`running workflow sync`);
        return runCustomWorkflowSync()
            .then((_: any) => {
                i(`done with workflow sync`);
            });
    },

    () => {
        i(`registrying global event subscription`);
        return registerEventsSubscription(v1AppRouter, registry).then((_: any) => {
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
               res(true);
           });
       });
    }
];

fns.reduce((p: Promise<any>, fn: PromiseFn) => {
    return p.then(_ => fn())
}, Promise.resolve());

