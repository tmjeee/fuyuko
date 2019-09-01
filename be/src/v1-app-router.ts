
import express, {Request, Response, NextFunction} from 'express';
const v1AppRouter = express.Router();

v1AppRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('test ok');
});

export default v1AppRouter;
