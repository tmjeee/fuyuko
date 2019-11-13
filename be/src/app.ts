import express, {NextFunction, Request, Response, Express} from 'express';
import cookieParser from 'cookie-parser';
import registerV1AppRouter from './route/v1/v1-app.router';
import cors from 'cors';
import {i} from './logger';
import {runUpdate} from './updater';
import {runBanner} from './banner';
import * as formidable from 'formidable';
import config from './config';
import {httpLogMiddlewareFn, timingLogMiddlewareFn} from "./route/v1/common-middleware";
import v1 = require("uuid/v1");

runBanner();

const port: number = Number(config.port);
const app: Express = express();

app.use(timingLogMiddlewareFn);
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(httpLogMiddlewareFn);

app.all('*', cors());
registerV1AppRouter(app);

i(`running db update`);
runUpdate()
    .then((_: any) => {
        i(`done db update`)
    });

app.listen(port, () => i(`started at port ${port}`));
