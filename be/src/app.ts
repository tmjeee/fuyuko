import express, {NextFunction, Request, Response, Express} from 'express';
import cookieParser from 'cookie-parser';
import v1AppRouter from './v1-app-router';
import cors from 'cors';
import formidable from 'formidable';

const port: number = 8888;
const app: Express = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.all('*', cors());
app.use('/v1', v1AppRouter);

app.listen(port, () => console.log(`started at port ${port}`))
