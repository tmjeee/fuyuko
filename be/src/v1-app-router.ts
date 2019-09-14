
import express, {Request, Response, NextFunction} from 'express';
import formidable, {Fields, Files} from 'formidable';
import util from 'util';

const v1AppRouter = express.Router();

v1AppRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('test ok');
});

v1AppRouter.post('/p', (req: Request, res: Response, next: NextFunction) => {
    new formidable.IncomingForm().parse(req, (error: any, fields: Fields, files: Files) => {

    });
});

export default v1AppRouter;
