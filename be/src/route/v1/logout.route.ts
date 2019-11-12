import {Router, Request, Response, NextFunction} from "express";
import {validateMiddlewareFn} from "./common-middleware";

const logoutHttpAction: any[] = [
    [],
    validateMiddlewareFn,
    (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({});
    }
]

const reg = (router: Router) => {
    router.post('/logout', ...logoutHttpAction);
};

export default reg;