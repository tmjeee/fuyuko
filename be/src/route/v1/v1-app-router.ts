
import express, {Request, Response, NextFunction, Router} from 'express';
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';
import registerRoutes from './register-route';

const v1AppRouter:Router  = express.Router();

v1AppRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('test ok');
});

v1AppRouter.post('/p', (req: Request, res: Response, next: NextFunction) => {
    new formidable.IncomingForm().parse(req, (error: any, fields: Fields, files: Files) => {
    });
});

registerRoutes(v1AppRouter);


export default v1AppRouter;
