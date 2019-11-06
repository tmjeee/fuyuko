
import express, {Request, Response, NextFunction, Router} from 'express';
import * as formidable from 'formidable';
import {Fields, Files} from 'formidable';
import util from 'util';

export const v1AppRouter:Router  = express.Router();

v1AppRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('test ok');
});

v1AppRouter.post('/p', (req: Request, res: Response, next: NextFunction) => {
    new formidable.IncomingForm().parse(req, (error: any, fields: Fields, files: Files) => {

    });
});

export default v1AppRouter;
