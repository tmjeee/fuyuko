import express, {NextFunction, Request, Response, Express} from 'express';
import cookieParser from 'cookie-parser';
import v1AppRouter from './v1-app-router';
import cors from 'cors';
import {i} from './logger';
import {runUpdate} from './updater';
import {runBanner} from './banner';
import * as formidable from 'formidable';

runBanner();

const port: number = 8888;
const app: Express = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.all('*', cors());
app.use('/v1', v1AppRouter);


i(`running db update`);
runUpdate()
    .then((r: any) => {
        i(`done db update`)
    });

app.listen(port, () => i(`started at port ${port}`));
