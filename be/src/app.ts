import express, {NextFunction, Request, Response, Express} from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import v1AppRouter from './v1-app-router';

const port: number = 8888;
const app: Express = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/v1', v1AppRouter);

app.listen(port, () => console.log(`started at port ${port}`))
