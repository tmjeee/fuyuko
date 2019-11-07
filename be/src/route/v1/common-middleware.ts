import {NextFunction, Request, Response} from "express";
import {validationResult, ValidationError} from 'express-validator';
import {e} from "../../logger";

export const validateMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const errors  = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
    } else {
        next();
    }
};

export const catchErrorMiddlewareFn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('before &&&&&&&&&&&&&&&&&&&&&&&& ');
        await next();
        console.log('after &&&&&&&&&&&&&&&&&&&&&&&& ');
    } catch (err) {
       e('Unexpected Error', err);
       res.status(500).json({
           errors: [
               {
                   value: "",
                   msg: `Unexpected Error: ${err.toString()}`,
                   param: "",
                   location: "system"
               }
           ]
       });
    }
};